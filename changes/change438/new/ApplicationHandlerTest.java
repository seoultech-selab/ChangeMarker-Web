// Copyright 2017 Yahoo Holdings. Licensed under the terms of the Apache 2.0 license. See LICENSE in the project root.
package com.yahoo.vespa.config.server.http.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yahoo.cloud.config.ConfigserverConfig;
import com.yahoo.config.provision.ApplicationId;
import com.yahoo.config.provision.ApplicationName;
import com.yahoo.config.provision.TenantName;
import com.yahoo.config.provision.Zone;
import com.yahoo.container.jdisc.HttpRequest;
import com.yahoo.container.jdisc.HttpResponse;
import com.yahoo.jdisc.Response;
import com.yahoo.vespa.config.server.ApplicationRepository;
import com.yahoo.vespa.config.server.MockLogRetriever;
import com.yahoo.vespa.config.server.MockTesterClient;
import com.yahoo.vespa.config.server.TestComponentRegistry;
import com.yahoo.vespa.config.server.application.ConfigConvergenceChecker;
import com.yahoo.vespa.config.server.application.HttpProxy;
import com.yahoo.vespa.config.server.application.OrchestratorMock;
import com.yahoo.vespa.config.server.deploy.InfraDeployerProvider;
import com.yahoo.vespa.config.server.http.HandlerTest;
import com.yahoo.vespa.config.server.http.HttpErrorResponse;
import com.yahoo.vespa.config.server.http.SessionHandlerTest;
import com.yahoo.vespa.config.server.http.StaticResponse;
import com.yahoo.vespa.config.server.provision.HostProvisionerProvider;
import com.yahoo.vespa.config.server.session.PrepareParams;
import com.yahoo.vespa.config.server.tenant.Tenant;
import com.yahoo.vespa.config.server.tenant.TenantBuilder;
import com.yahoo.vespa.config.server.tenant.TenantRepository;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.client.Client;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.time.Clock;

import static com.yahoo.config.model.api.container.ContainerServiceType.CLUSTERCONTROLLER_CONTAINER;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * @author hmusum
 */
public class ApplicationHandlerTest {

    private static File testApp = new File("src/test/apps/app");

    private ListApplicationsHandler listApplicationsHandler;
    private final static TenantName mytenantName = TenantName.from("mytenant");
    private final static TenantName foobar = TenantName.from("foobar");
    private final static ApplicationId applicationId = new ApplicationId.Builder().applicationName(ApplicationName.defaultName()).tenant(mytenantName).build();

    private TenantRepository tenantRepository;
    private ApplicationRepository applicationRepository;
    private SessionHandlerTest.MockProvisioner provisioner;
    private MockStateApiFactory stateApiFactory = new MockStateApiFactory();
    private OrchestratorMock orchestrator;

    @Before
    public void setup() {
        TestComponentRegistry componentRegistry = new TestComponentRegistry.Builder().build();
        tenantRepository = new TenantRepository(componentRegistry, false);
        tenantRepository.addTenant(TenantBuilder.create(componentRegistry, mytenantName));
        tenantRepository.addTenant(TenantBuilder.create(componentRegistry, foobar));
        provisioner = new SessionHandlerTest.MockProvisioner();
        orchestrator = new OrchestratorMock();
        applicationRepository = new ApplicationRepository(tenantRepository,
                                                          provisioner,
                                                          orchestrator,
                                                          new ConfigserverConfig(new ConfigserverConfig.Builder()),
                                                          new MockLogRetriever(),
                                                          Clock.systemUTC(),
                                                          new MockTesterClient());
        listApplicationsHandler = new ListApplicationsHandler(ListApplicationsHandler.testOnlyContext(),
                                                              tenantRepository,
                                                              Zone.defaultZone());
    }

    @Test
    public void testDelete() throws Exception {
        {
            applicationRepository.deploy(testApp, prepareParams(applicationId));
            Tenant mytenant = tenantRepository.getTenant(applicationId.tenant());
            deleteAndAssertOKResponse(mytenant, applicationId);
        }
        
        {
            applicationRepository.deploy(testApp, prepareParams(applicationId));
            deleteAndAssertOKResponseMocked(applicationId, true);
            applicationRepository.deploy(testApp, prepareParams(applicationId));

            ApplicationId fooId = new ApplicationId.Builder()
                    .tenant(foobar)
                    .applicationName("foo")
                    .instanceName("quux")
                    .build();
            PrepareParams prepareParams2 = new PrepareParams.Builder().applicationId(fooId).build();
            applicationRepository.deploy(testApp, prepareParams2);

            assertApplicationExists(fooId, Zone.defaultZone());
            deleteAndAssertOKResponseMocked(fooId, true);
            assertApplicationExists(applicationId, Zone.defaultZone());

            deleteAndAssertOKResponseMocked(applicationId, true);
        }

        {
            ApplicationId baliId = new ApplicationId.Builder()
                    .tenant(mytenantName)
                    .applicationName("bali")
                    .instanceName("quux")
                    .build();
            PrepareParams prepareParamsBali = new PrepareParams.Builder().applicationId(baliId).build();
            applicationRepository.deploy(testApp, prepareParamsBali);
            deleteAndAssertOKResponseMocked(baliId, true);
        }
    }

    @Test
    public void testDeleteNonExistent() throws Exception {
        deleteAndAssertResponse(applicationId,
                                Zone.defaultZone(),
                                Response.Status.NOT_FOUND,
                                HttpErrorResponse.errorCodes.NOT_FOUND,
                                "Unable to delete mytenant.default.default: Not found");
    }

    @Test
    public void testGet() throws Exception {
        long sessionId = applicationRepository.deploy(testApp, prepareParams(applicationId)).sessionId();
        assertApplicationGeneration(applicationId, Zone.defaultZone(), sessionId, true);
        assertApplicationGeneration(applicationId, Zone.defaultZone(), sessionId, false);
    }

    @Test
    public void testRestart() throws Exception {
        applicationRepository.deploy(testApp, prepareParams(applicationId));
        assertFalse(provisioner.restarted);
        restart(applicationId, Zone.defaultZone());
        assertTrue(provisioner.restarted);
        assertEquals(applicationId, provisioner.lastApplicationId);
    }

    @Test
    public void testSuspended() throws Exception {
        applicationRepository.deploy(testApp, prepareParams(applicationId));
        assertSuspended(false, applicationId, Zone.defaultZone());
        orchestrator.suspend(applicationId);
        assertSuspended(true, applicationId, Zone.defaultZone());
    }

    @Test
    public void testConverge() throws Exception {
        applicationRepository.deploy(testApp, prepareParams(applicationId));
        converge(applicationId, Zone.defaultZone());
    }

    @Test
    public void testClusterControllerStatus() throws Exception {
        applicationRepository.deploy(testApp, prepareParams(applicationId));
        String host = "foo.yahoo.com";
        String url = toUrlPath(applicationId, Zone.defaultZone(), true) + "/clustercontroller/" + host + "/status/v1/clusterName1";
        HttpProxy mockHttpProxy = mock(HttpProxy.class);
        ApplicationRepository applicationRepository = new ApplicationRepository(tenantRepository,
                                                                                HostProvisionerProvider.withProvisioner(provisioner),
                                                                                InfraDeployerProvider.empty(),
                                                                                new ConfigConvergenceChecker(stateApiFactory),
                                                                                mockHttpProxy,
                                                                                new ConfigserverConfig(new ConfigserverConfig.Builder()),
                                                                                new OrchestratorMock(),
                                                                                new MockTesterClient());
        ApplicationHandler mockHandler = createApplicationHandler(applicationRepository);
        when(mockHttpProxy.get(any(), eq(host), eq(CLUSTERCONTROLLER_CONTAINER.serviceName),eq("clustercontroller-status/v1/clusterName1")))
                .thenReturn(new StaticResponse(200, "text/html", "<html>...</html>"));

        HttpResponse response = mockHandler.handle(HttpRequest.createTestRequest(url, com.yahoo.jdisc.http.HttpRequest.Method.GET));
        HandlerTest.assertHttpStatusCodeAndMessage(response, 200, "text/html", "<html>...</html>");
    }

    @Test
    public void testPutIsIllegal() throws IOException {
        assertNotAllowed(com.yahoo.jdisc.http.HttpRequest.Method.PUT);
    }

    @Test
    public void testFileDistributionStatus() throws Exception {
        applicationRepository.deploy(testApp, prepareParams(applicationId));
        Zone zone = Zone.defaultZone();

        HttpResponse response = fileDistributionStatus(applicationId, zone);
        assertEquals(200, response.getStatus());
        SessionHandlerTest.getRenderedString(response);
        assertEquals("{\"hosts\":[{\"hostname\":\"mytesthost\",\"status\":\"UNKNOWN\",\"message\":\"error: Connection error(104)\",\"fileReferences\":[]}],\"status\":\"UNKNOWN\"}",
                     SessionHandlerTest.getRenderedString(response));

        // 404 for unknown application
        ApplicationId unknown = new ApplicationId.Builder().applicationName("unknown").tenant(mytenantName).build();
        HttpResponse responseForUnknown = fileDistributionStatus(unknown, zone);
        assertEquals(404, responseForUnknown.getStatus());
        assertEquals("{\"error-code\":\"NOT_FOUND\",\"message\":\"No such application id: 'mytenant.unknown'\"}",
                     SessionHandlerTest.getRenderedString(responseForUnknown));
    }

    @Test
    public void testGetLogs() throws IOException {
        applicationRepository.deploy(new File("src/test/apps/app-logserver-with-container"), prepareParams(applicationId));
        String url = toUrlPath(applicationId, Zone.defaultZone(), true) + "/logs?from=100&to=200";
        ApplicationHandler mockHandler = createApplicationHandler();

        HttpResponse response = mockHandler.handle(HttpRequest.createTestRequest(url, com.yahoo.jdisc.http.HttpRequest.Method.GET));
        assertEquals(200, response.getStatus());

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        response.render(baos);
        assertEquals("log line", baos.toString());
    }

    @Test
    public void testTesterStatus() throws IOException {
        applicationRepository.deploy(testApp, prepareParams(applicationId));
        String url = toUrlPath(applicationId, Zone.defaultZone(), true) + "/tester/status";
        ApplicationHandler mockHandler = createApplicationHandler();

        HttpResponse response = mockHandler.handle(HttpRequest.createTestRequest(url, com.yahoo.jdisc.http.HttpRequest.Method.GET));
        assertEquals(200, response.getStatus());

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        response.render(baos);
        assertEquals("OK", baos.toString());
    }

    private void assertNotAllowed(com.yahoo.jdisc.http.HttpRequest.Method method) throws IOException {
        String url = "http://myhost:14000/application/v2/tenant/" + mytenantName + "/application/default";
        deleteAndAssertResponse(url, Response.Status.METHOD_NOT_ALLOWED, HttpErrorResponse.errorCodes.METHOD_NOT_ALLOWED, "{\"error-code\":\"METHOD_NOT_ALLOWED\",\"message\":\"Method '" + method + "' is not supported\"}",
                                method);
    }

    private void deleteAndAssertOKResponseMocked(ApplicationId applicationId, boolean fullAppIdInUrl) throws IOException {
        long sessionId = tenantRepository.getTenant(applicationId.tenant()).getApplicationRepo().requireActiveSessionOf(applicationId);
        deleteAndAssertResponse(applicationId, Zone.defaultZone(), Response.Status.OK, null, fullAppIdInUrl);
        assertNull(tenantRepository.getTenant(applicationId.tenant()).getLocalSessionRepo().getSession(sessionId));
    }

    private void deleteAndAssertOKResponse(Tenant tenant, ApplicationId applicationId) throws IOException {
        long sessionId = tenant.getApplicationRepo().requireActiveSessionOf(applicationId);
        deleteAndAssertResponse(applicationId, Zone.defaultZone(), Response.Status.OK, null, true);
        assertNull(tenant.getLocalSessionRepo().getSession(sessionId));
    }

    private void deleteAndAssertResponse(ApplicationId applicationId, Zone zone, int expectedStatus, HttpErrorResponse.errorCodes errorCode, boolean fullAppIdInUrl) throws IOException {
        String expectedResponse = "{\"message\":\"Application '" + applicationId + "' deleted\"}";
        deleteAndAssertResponse(toUrlPath(applicationId, zone, fullAppIdInUrl), expectedStatus, errorCode, expectedResponse, com.yahoo.jdisc.http.HttpRequest.Method.DELETE);
    }

    private void deleteAndAssertResponse(ApplicationId applicationId, Zone zone, int expectedStatus, HttpErrorResponse.errorCodes errorCode, String expectedResponse) throws IOException {
        deleteAndAssertResponse(toUrlPath(applicationId, zone, true), expectedStatus, errorCode, expectedResponse, com.yahoo.jdisc.http.HttpRequest.Method.DELETE);
    }

    private void deleteAndAssertResponse(String url, int expectedStatus, HttpErrorResponse.errorCodes errorCode, String expectedResponse, com.yahoo.jdisc.http.HttpRequest.Method method) throws IOException {
        ApplicationHandler handler = createApplicationHandler();
        HttpResponse response = handler.handle(HttpRequest.createTestRequest(url, method));
        if (expectedStatus == 200) {
            HandlerTest.assertHttpStatusCodeAndMessage(response, 200, expectedResponse);
        } else {
            HandlerTest.assertHttpStatusCodeErrorCodeAndMessage(response, expectedStatus, errorCode, expectedResponse);
        }
    }

    private void assertApplicationGeneration(ApplicationId applicationId, Zone zone, long expectedGeneration, boolean fullAppIdInUrl) throws IOException {
        assertApplicationGeneration(toUrlPath(applicationId, zone, fullAppIdInUrl), expectedGeneration);
    }

    private void assertSuspended(boolean expectedValue, ApplicationId application, Zone zone) throws IOException {
        String restartUrl = toUrlPath(application, zone, true) + "/suspended";
        HttpResponse response = createApplicationHandler().handle(HttpRequest.createTestRequest(restartUrl, com.yahoo.jdisc.http.HttpRequest.Method.GET));
        HandlerTest.assertHttpStatusCodeAndMessage(response, 200, "{\"suspended\":" + expectedValue + "}");
    }

    private String toUrlPath(ApplicationId application, Zone zone, boolean fullAppIdInUrl) {
        String url = "http://myhost:14000/application/v2/tenant/" + application.tenant().value() + "/application/" + application.application().value();
        if (fullAppIdInUrl)
            url = url + "/environment/" + zone.environment().value() + "/region/" + zone.region().value() + "/instance/" + application.instance().value();
        return url;
    }

    private void assertApplicationGeneration(String url, long expectedGeneration) throws IOException {
        HttpResponse response = createApplicationHandler().handle(HttpRequest.createTestRequest(url, com.yahoo.jdisc.http.HttpRequest.Method.GET));
        HandlerTest.assertHttpStatusCodeAndMessage(response, 200, "{\"generation\":" + expectedGeneration + "}");
    }

    private void assertApplicationExists(ApplicationId applicationId, Zone zone) throws IOException {
        String tenantName = applicationId == null ? null : applicationId.tenant().value();
        String expected = applicationId == null ? "[]" : "[\"http://myhost:14000/application/v2/tenant/" + tenantName + "/application/" + applicationId.application().value() +
                "/environment/" + zone.environment().value() +
                "/region/" + zone.region().value() +
                "/instance/" + applicationId.instance().value() + "\"]";
        ListApplicationsHandlerTest.assertResponse(listApplicationsHandler, "http://myhost:14000/application/v2/tenant/" + tenantName + "/application/",
                Response.Status.OK,
                expected,
                com.yahoo.jdisc.http.HttpRequest.Method.GET);
    }

    private void restart(ApplicationId application, Zone zone) throws IOException {
        String restartUrl = toUrlPath(application, zone, true) + "/restart";
        HttpResponse response = createApplicationHandler().handle(HttpRequest.createTestRequest(restartUrl, com.yahoo.jdisc.http.HttpRequest.Method.POST));
        HandlerTest.assertHttpStatusCodeAndMessage(response, 200, "");
    }

    private void converge(ApplicationId application, Zone zone) throws IOException {
        String convergeUrl = toUrlPath(application, zone, true) + "/serviceconverge";
        HttpResponse response = createApplicationHandler().handle(HttpRequest.createTestRequest(convergeUrl, com.yahoo.jdisc.http.HttpRequest.Method.GET));
        HandlerTest.assertHttpStatusCodeAndMessage(response, 200, "");
    }

    private HttpResponse fileDistributionStatus(ApplicationId application, Zone zone) {
        String restartUrl = toUrlPath(application, zone, true) + "/filedistributionstatus";
        return createApplicationHandler().handle(HttpRequest.createTestRequest(restartUrl, com.yahoo.jdisc.http.HttpRequest.Method.GET));
    }

    private static class MockStateApiFactory implements ConfigConvergenceChecker.StateApiFactory {
        boolean createdApi = false;
        @Override
        public ConfigConvergenceChecker.StateApi createStateApi(Client client, URI serviceUri) {
            createdApi = true;
            return () -> {
                try {
                    return new ObjectMapper().readTree("{\"config\":{\"generation\":1}}");
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            };
        }
    }

    private ApplicationHandler createApplicationHandler() {
        return createApplicationHandler(applicationRepository);
    }

    private ApplicationHandler createApplicationHandler(ApplicationRepository applicationRepository) {
        return new ApplicationHandler(ApplicationHandler.testOnlyContext(), Zone.defaultZone(), applicationRepository);
    }

    private PrepareParams prepareParams(ApplicationId applicationId) {
        return new PrepareParams.Builder().applicationId(applicationId).build();
    }

}
