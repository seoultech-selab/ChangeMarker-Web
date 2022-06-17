/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.ballerinalang.langlib.string;

import org.ballerinalang.jvm.api.BStringUtils;
import org.ballerinalang.jvm.api.values.BString;
import org.ballerinalang.jvm.internal.ErrorUtils;
/**
 * Extern function ballerina.model.strings:trim.
 *
 * @since 0.8.0
 */
//@BallerinaFunction(
//        orgName = "ballerina", packageName = "lang.string",
//        functionName = "trim",
//        args = {@Argument(name = "s", type = TypeKind.STRING)},
//        returnType = {@ReturnType(type = TypeKind.STRING)},
//        isPublic = true
//)
public class Trim {

    public static BString trim(BString str) {
        if (str == null) {
            throw ErrorUtils.createNullReferenceError();
        }
        return BStringUtils.fromString(str.getValue().trim());
    }
}
