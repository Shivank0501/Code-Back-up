import { Header, MultiLink } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
// import { newConfigMutate } from "../../config/Mutate/config";
// import TransfererDetails from "../../pageComponents/Mutate/TransfererDetails";
// import MutationApplicationDetails from "./MutationApplicatinDetails";
import getPTAcknowledgementData from "../../getPTAcknowledgementData";


const ApplicationDetails = () => {
  const { t } = useTranslation();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { tenants } = storeData || {};
  const { id: applicationNumber } = useParams();
  const [showToast, setShowToast] = useState(null);
  const [appDetailsToShow, setAppDetailsToShow] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [enableAudit, setEnableAudit] = useState(false);
  const [businessService, setBusinessService] = useState("ptr");
  


  sessionStorage.setItem("applicationNoinAppDetails",applicationNumber);

 

  
  


  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ptr.usePtrApplicationDetail(t, tenantId, applicationNumber);
  
  console.log("isError",applicationDetails)

  
  
  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ptr.usePTRApplicationAction(tenantId);
  
  console.log("updatingApplication", updatingApplication )
  console.log("updateApplicationError", updateApplicationError )
  console.log("updateResponse", updateResponse )
  console.log("updateError", updateError )
  console.log("mutate", mutate )



  console.log("======================" )
  console.log("applicationDetails",  applicationDetails?.applicationData?.tenantId )
    // console.log("applicationData", applicationData )

  console.log("====================="  )

  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.applicationData?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.applicationData?.applicationNumber,
    moduleCode: businessService,
    role: "PT_CEMP",
  });
  
  
  console.log("what is workflowDetails servie = ",workflowDetails )

  



  const { isLoading: auditDataLoading, isError: isAuditError, data: auditData } = Digit.Hooks.ptr.usePTRSearch(
    {
      tenantId,
      filters: { applicationNumber: applicationNumber, audit: true },
    },
   // { enabled: enableAudit, select: (data) => data.PetRegistrationApplications?.filter((e) => e.status === "ACTIVE") }
  );

  // console.log("$$$$", applicationDetails?.data)
  // const showTransfererDetails = React.useCallback(() => {
  //   if (
  //     auditData &&
  //     Object.keys(appDetailsToShow).length &&
  //     applicationDetails?.applicationData?.status !== "ACTIVE" &&
  //     applicationDetails?.applicationData?.creationReason === "ptr" 
  //   ) {
  //     // let applicationDetails = appDetailsToShow.applicationDetails?.filter((e) => e.title === "PT_OWNERSHIP_INFO_SUB_HEADER");
  //     let compConfig = newConfigMutate.reduce((acc, el) => [...acc, ...el.body], []).find((e) => e.component === "TransfererDetails");
  //     applicationDetails.unshift({
  //       // title: "PT_MUTATION_TRANSFEROR_DETAILS",
  //       belowComponent: () => <TransfererDetails userType="employee" formData={{ originalData: auditData[0] }} config={compConfig} />,
  //     });
  //     setAppDetailsToShow({ ...appDetailsToShow, applicationDetails });
  //   }
  // },[setAppDetailsToShow,appDetailsToShow,auditData,applicationDetails,auditData,newConfigMutate]);

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (applicationDetails) {
      console.log("use effect application details", applicationDetails);
      setAppDetailsToShow(_.cloneDeep(applicationDetails));
      // if (applicationDetails?.applicationData?.status !== "ACTIVE" && applicationDetails?.applicationData?.creationReason === "MUTATION") {
        // setEnableAudit(true);
      // }
    }
  }, [applicationDetails]);

  // useEffect(() => {
  //   showTransfererDetails();
  //   if (appDetailsToShow?.applicationData?.status === "ACTIVE" && PT_CEMP&&businessService=="ptr") {
  //      setBusinessService("ptr");
  //     }
  // }, [auditData, applicationDetails, appDetailsToShow]);

  useEffect(() => {
    // console.log("use effect Workflow Details:", workflowDetails?.data?.applicationBusinessService);
    // if (workflowDetails?.data?.applicationBusinessService && !(workflowDetails?.data?.applicationBusinessService === "PT.CREATE" && businessService === "PT.UPDATE"))
    if (workflowDetails?.data?.applicationBusinessService && !(workflowDetails?.data?.applicationBusinessService === "ptr" && businessService === "ptr"))
    

    {
      setBusinessService(workflowDetails?.data?.applicationBusinessService);
      

      //setBusinessService("ptr");

    }
  }, [workflowDetails.data]);

  console.log("use effect :", workflowDetails.data);


 

  

  // if (
  //   PT_CEMP &&
  //   workflowDetails?.data?.applicationBusinessService === "ptr" &&
  //   workflowDetails?.data?.actionState?.nextActions?.find((act) => act.action === "PAY")
  // ) {
  //   workflowDetails.data.actionState.nextActions = workflowDetails?.data?.actionState?.nextActions.map((act) => {
  //     if (act.action === "PAY") {
  //       return {
  //         action: "PAY",
  //         forcedName: "WF_EMPLOYEE_PT.MUTATION_PAY",
  //         redirectionUrl: { pathname: `/digit-ui/employee/payment/collect/PT.MUTATION/${appDetailsToShow?.applicationData?.applicationNumber}` },
  //       };
  //     }
  //     return act;
  //   });
  // }


  const wfDocs = workflowDetails.data?.timeline?.reduce((acc, { wfDocuments }) => {
    return wfDocuments ? [...acc, ...wfDocuments] : acc;
  }, []);
  let appdetailsDocuments = appDetailsToShow?.applicationDetails?.find((e) => e.title === "PT_OWNERSHIP_INFO_SUB_HEADER")?.additionalDetails
    ?.documents;

  if (appdetailsDocuments && wfDocs?.length && !appdetailsDocuments?.find((e) => e.title === "PT_WORKFLOW_DOCS")) {
    appDetailsToShow.applicationDetails.find((e) => e.title === "PT_OWNERSHIP_INFO_SUB_HEADER").additionalDetails.documents = [
      ...appdetailsDocuments,
      {
        title: "PT_WORKFLOW_DOCS",
        values: wfDocs?.map?.((e) => ({ ...e, title: e.documentType })),
      },
    ];
  }

  const handleDownloadPdf = async () => {
    const PetRegistrationApplications = appDetailsToShow?.applicationData ;
    const tenantInfo  = tenants.find((tenant) => tenant.code === PetRegistrationApplications.tenantId);

    const data = await getPTAcknowledgementData(PetRegistrationApplications, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  const propertyDetailsPDF = {
    order: 1,
    label: t("PTR_APPLICATION"),
    onClick: () => handleDownloadPdf(),
  };
  let dowloadOptions = [propertyDetailsPDF];



  return (
    <div>
        <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
      <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("PTR_PET_APPLICATION_DETAILS")}</Header>
      {console.log(" dowloadOptions", dowloadOptions)}
      {dowloadOptions && dowloadOptions.length > 0 && (
            <MultiLink
              className="multilinkWrapper employee-mulitlink-main-div"
              onHeadClick={() => setShowOptions(!showOptions)}
              displayOptions={showOptions}
              options={dowloadOptions}
              downloadBtnClassName={"employee-download-btn-className"}
              optionsClassName={"employee-options-btn-className"}
            />
          )}
          </div>
          
      
      <ApplicationDetailsTemplate
        applicationDetails={appDetailsToShow}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={appDetailsToShow?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService={businessService}
        moduleCode="pet-services"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"PTR_COMMON_STATUS_"}
        forcedActionPrefix={"EMPLOYEE_PTR"}
        statusAttribute={"state"}
        MenuStyle={{ color: "#FFFFFF", fontSize: "18px" }}
      />
    
    </div>
  );
};

export default React.memo(ApplicationDetails);
