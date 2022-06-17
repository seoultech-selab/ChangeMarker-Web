// Copyright 2017 Yahoo Holdings. Licensed under the terms of the Apache 2.0 license. See LICENSE in the project root.
package com.yahoo.vespa.model.builder.xml.dom;

import com.yahoo.config.application.api.FileRegistry;
import com.yahoo.config.model.ConfigModelContext;
import com.yahoo.config.model.api.ConfigServerSpec;
import com.yahoo.config.model.deploy.DeployState;
import com.yahoo.config.model.producer.AbstractConfigProducer;
import com.yahoo.text.XML;
import com.yahoo.log.LogLevel;
import com.yahoo.vespa.model.SimpleConfigProducer;
import com.yahoo.vespa.model.admin.Admin;
import com.yahoo.vespa.model.admin.Configserver;
import com.yahoo.vespa.model.admin.Logserver;
import com.yahoo.vespa.model.admin.Slobrok;
import com.yahoo.vespa.model.admin.clustercontroller.ClusterControllerCluster;
import com.yahoo.vespa.model.admin.clustercontroller.ClusterControllerContainer;
import com.yahoo.vespa.model.admin.clustercontroller.ClusterControllerClusterVerifier;
import com.yahoo.vespa.model.builder.xml.dom.VespaDomBuilder.DomConfigProducerBuilder;
import com.yahoo.vespa.model.container.Container;
import com.yahoo.vespa.model.container.ContainerCluster;
import com.yahoo.vespa.model.container.xml.ContainerModelBuilder;
import org.w3c.dom.Element;

import java.util.List;
import java.util.ArrayList;
import java.util.Objects;
import java.util.logging.Level;

/**
 * Builds the admin model from a V2 admin XML tag.
 *
 * @author vegardh
 */
public class DomAdminV2Builder extends DomAdminBuilderBase {

    private static final String ATTRIBUTE_CLUSTER_CONTROLLER_STANDALONE_ZK = "standalone-zookeeper";

    public DomAdminV2Builder(ConfigModelContext.ApplicationType applicationType,
                             FileRegistry fileRegistry,
                             boolean multitenant,
                             List<ConfigServerSpec> configServerSpecs) {
        super(applicationType, fileRegistry, multitenant, configServerSpecs);
    }

    @Override
    protected void doBuildAdmin(DeployState deployState, Admin admin, Element adminE) {
        List<Configserver> configservers = parseConfigservers(deployState, admin, adminE);
        admin.setLogserver(parseLogserver(deployState, admin, adminE));
        admin.addConfigservers(configservers);
        admin.addSlobroks(getSlobroks(deployState, admin, XML.getChild(adminE, "slobroks")));
        if ( ! admin.multitenant())
            admin.setClusterControllers(addConfiguredClusterControllers(deployState, admin, adminE));

        ModelElement adminElement = new ModelElement(adminE);
        addLogForwarders(adminElement.getChild("logforwarding"), admin);

        if (adminElement.getChild("filedistribution") != null) {
            deployState.getDeployLogger().log(LogLevel.WARNING, "'filedistribution' element is deprecated and ignored");
        }
    }

    private List<Configserver> parseConfigservers(DeployState deployState, Admin admin, Element adminE) {
        List<Configserver> configservers;
        if (multitenant) {
            configservers = getConfigServersFromSpec(deployState.getDeployLogger(), admin);
        } else {
            configservers = getConfigServers(deployState, admin, adminE);
        }
        int count = configservers.size();
        if (count % 2 == 0) {
            deployState.getDeployLogger().log(Level.WARNING, "An even number (" + count + ") of config servers have been configured. " +
                    "This is discouraged, see doc for configuration server ");
        }
        return configservers;
    }

    private Logserver parseLogserver(DeployState deployState, Admin admin, Element adminE) {
        Element logserverE = XML.getChild(adminE, "logserver");
        if (logserverE == null) {
            logserverE = XML.getChild(adminE, "adminserver");
        }
        return new LogserverBuilder().build(deployState, admin, logserverE);
    }

    private ContainerCluster addConfiguredClusterControllers(DeployState deployState, AbstractConfigProducer parent, Element admin) {
        Element controllersElements = XML.getChild(admin, "cluster-controllers");
        if (controllersElements == null) return null;

        List<Element> controllers = XML.getChildren(controllersElements, "cluster-controller");
        if (controllers.isEmpty()) return null;

        boolean standaloneZooKeeper = "true".equals(controllersElements.getAttribute(ATTRIBUTE_CLUSTER_CONTROLLER_STANDALONE_ZK)) || multitenant;
        if (standaloneZooKeeper) {
            parent = new ClusterControllerCluster(parent, "standalone");
        }
        ContainerCluster cluster = new ContainerCluster(parent,
                                                        "cluster-controllers",
                                                        "cluster-controllers",
                                                        new ClusterControllerClusterVerifier(), deployState);
        ContainerModelBuilder.addDefaultHandler_legacyBuilder(cluster);

        List<Container> containers = new ArrayList<>();

        for (Element controller : controllers) {
            ClusterControllerContainer clusterController = new ClusterControllerBuilder(containers.size(), standaloneZooKeeper).build(deployState, cluster, controller);
            containers.add(clusterController);
        }

        cluster.addContainers(containers);
        return cluster;
    }

    // Extra stupid because configservers tag is optional
    private List<Configserver> getConfigServers(DeployState deployState, AbstractConfigProducer parent, Element adminE) {
        SimpleConfigProducer configServers = new SimpleConfigProducer(parent, "configservers");
        List<Configserver> cfgs = new ArrayList<>();
        Element configserversE = XML.getChild(adminE, "configservers");
        if (configserversE == null) {
            Element configserverE = XML.getChild(adminE, "configserver");
            if (configserverE == null) {
                configserverE = XML.getChild(adminE, "adminserver");
            } else {
                deployState.getDeployLogger().log(LogLevel.INFO, "Specifying configserver without parent element configservers in services.xml is deprecated");
            }
            Configserver cfgs0 = new ConfigserverBuilder(0, configServerSpecs).build(deployState, configServers, configserverE);
            cfgs0.setProp("index", 0);
            cfgs.add(cfgs0);
            return cfgs;
        }
        // configservers tag in use
        int i = 0;
        for (Element configserverE : XML.getChildren(configserversE, "configserver")) {
            Configserver cfgsrv = new ConfigserverBuilder(i, configServerSpecs).build(deployState, configServers, configserverE);
            cfgsrv.setProp("index", i);
            cfgs.add(cfgsrv);
            i++;
        }
        return cfgs;
    }

    private List<Slobrok> getSlobroks(DeployState deployState, AbstractConfigProducer parent, Element slobroksE) {
        List<Slobrok> slobs = new ArrayList<>();
        if (slobroksE != null) {
            slobs = getExplicitSlobrokSetup(deployState, parent, slobroksE);
        }
        return slobs;
    }

    private List<Slobrok> getExplicitSlobrokSetup(DeployState deployState, AbstractConfigProducer parent, Element slobroksE) {
        List<Slobrok> slobs = new ArrayList<>();
        List<Element> slobsE = XML.getChildren(slobroksE, "slobrok");
        int i = 0;
        for (Element e : slobsE) {
            Slobrok slob = new SlobrokBuilder(i).build(deployState, parent, e);
            slobs.add(slob);
            i++;
        }
        return slobs;
    }

    private static class LogserverBuilder extends DomConfigProducerBuilder<Logserver> {
        public LogserverBuilder() {
        }

        @Override
        protected Logserver doBuild(DeployState deployState, AbstractConfigProducer parent, Element producerSpec) {
            return new Logserver(parent);
        }
    }

    private static class ConfigserverBuilder extends DomConfigProducerBuilder<Configserver> {
        private final int i;
        private final int rpcPort;

        public ConfigserverBuilder(int i, List<ConfigServerSpec> configServerSpec) {
            this.i = i;
            Objects.requireNonNull(configServerSpec);
            if (configServerSpec.size() > 0)
                this.rpcPort = configServerSpec.get(0).getConfigServerPort();
            else
                this.rpcPort = Configserver.defaultRpcPort;
        }

        @Override
        protected Configserver doBuild(DeployState deployState, AbstractConfigProducer parent, Element spec) {
            return new Configserver(parent, "configserver." + i, rpcPort);
        }
    }

    private static class SlobrokBuilder extends DomConfigProducerBuilder<Slobrok> {
        int i;

        public SlobrokBuilder(int i) {
            this.i = i;
        }

        @Override
        protected Slobrok doBuild(DeployState deployState, AbstractConfigProducer parent, Element spec) {
            return new Slobrok(parent, i);
        }
    }

    private static class ClusterControllerBuilder extends DomConfigProducerBuilder<ClusterControllerContainer> {
        int i;
        boolean runStandaloneZooKeeper;

        public ClusterControllerBuilder(int i, boolean runStandaloneZooKeeper) {
            this.i = i;
            this.runStandaloneZooKeeper = runStandaloneZooKeeper;
        }

        @Override
        protected ClusterControllerContainer doBuild(DeployState deployState, AbstractConfigProducer parent, Element spec) {
            return new ClusterControllerContainer(parent, i, runStandaloneZooKeeper, deployState.isHosted());
        }
    }
}
