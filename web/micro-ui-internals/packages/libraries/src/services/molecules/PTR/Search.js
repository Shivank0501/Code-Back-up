// import { getPropertySubtypeLocale, getPropertyTypeLocale } from "../../../utils/pt";
import { PTRService } from "../../elements/PTR";

export const PTRSearch = {
  
  all: async (tenantId, filters = {}) => {
    console.log("olo", response)
    
    const response = await PTRService.search({ tenantId, filters });
    
    return response;
  },
 
  // genericPropertyDetails: async (t, tenantId, applicationNumber) => {
  //   console.log("sdfjsdks", applicationNumber)
  //   console.log("tenantid",tenantId )
  //   const filters = { applicationNumber };
  //   const PetRegistrationApplications = await PTRSearch.application(tenantId, filters);
  //   console.log("PetRegistrationApplications", PetRegistrationApplications)
  //   const addressDetails = {
  //     title: "PT_PROPERTY_ADDRESS_SUB_HEADER",
  //     asSectionHeader: true,
  //     values: [
  //       { title: "PT_PROPERTY_ADDRESS_PINCODE", value: PetRegistrationApplications?.address?.pincode },
  //       { title: "PT_PROPERTY_ADDRESS_CITY", value: PetRegistrationApplications?.address?.city },
        
  //       // {
  //       //   title: "PT_PROPERTY_ADDRESS_STREET_NAME",
  //       //   value: PetRegistrationApplications?.address?.street,
  //       //   privacy: {
  //       //     uuid: PetRegistrationApplications?.owners?.[0]?.uuid,
  //       //     fieldName: "street",
  //       //     model: "Property",
  //       //     showValue: false,
  //       //     loadData: {
  //       //       serviceName:"/pet-services/pet-registration/_search",
  //       //       requestBody: {},
  //       //       requestParam: { tenantId, applicationNumber },
  //       //       jsonPath: "PetRegistrationApplications[0].address.street",
  //       //       isArray: false,
  //       //     },
  //       //   },
  //       // },
  //     ],
  //   };
   

  //   const applicationDetails = [propertyDetail, addressDetails, assessmentDetails, ownerdetails];
  //   return {
  //     tenantId: PetRegistrationApplications?.tenantId,
  //     applicationDetails,
  //     applicationData: PetRegistrationApplications,
  //   };
  //},

  
  application: async (tenantId, filters = {}) => {
    const response = await PTRService.search({ tenantId, filters });
    return response.PetRegistrationApplications[0];
  },
  RegistrationDetails: ({ PetRegistrationApplications: response, t }) => {
    return [

      {
        title: "PTR_APPLICANT_DETAILS_HEADER",
        asSectionHeader: true,
        values: [
          { title: "PTR_APPLICATION_NUMBER", value: response?.applicationNumber },
          { title: "PTR_APPLICANT_NAME", value: response?.applicantName },
          { title: "PTR_FATHER/HUSBAND_NAME", value: response?.fatherName },
          { title: "PTR_APPLICANT_MOBILE_NO", value: response?.mobileNumber },
          { title: "PTR_APPLICANT__ALTERNATE_NO", value: response?.alternateNumber },
          { title: "PTR_APPLICANT_EMAILID", value: response?.emailId },
        ],
      },

      {
        title: "PTR_PET_DETAILS_HEADER",
        asSectionHeader: true,
        values: [
          { title: "PTR_PET_TYPE", value: response?.petDetails?.petType },
          { title: "PTR_BREED_TYPE", value: response?.petDetails?.breedType },
          { title: "PTR_PET_NAME", value: response?.petDetails?.petName },
          { title: "PTR_PET_SEX", value: response?.petDetails?.petGender },
          { title: "PTR_DOCTOR_NAME", value: response?.petDetails?.doctorName },
          { title: "PTR_CLINIC_NAME", value: response?.petDetails?.clinicName },
          { title: "PTR_VACCINATED_DATE", value: response?.petDetails?.lastVaccineDate },
          { title: "PTR_VACCINATION_NUMBER", value: response?.petDetails?.vaccinationNumber },


        ],
      },

      {
        title: "PTR_ADDRESS_HEADER",
        asSectionHeader: true,
        values: [
          { title: "PTR_ADDRESS_PINCODE", value: response?.address?.pincode },
          { title: "PTR_ADDRESS_CITY", value: response?.address?.city },
          { title: "PTR_STREET_NAME",value: response?.address?.street, },
          { title: "PTR_HOUSE_NO",value: response?.address?.doorNo,},
          
  
        ],
      },

      {
        title: "PT_OWNERSHIP_INFO_SUB_HEADER",
        additionalDetails: {
         
          documents: [
            {
              title: "PTR_COMMON_DOCS",
              values: response?.documents
                // ?.filter((e) => e.status === "ACTIVE")
                ?.map((document) => {
                  return {
                    title: `PT_${document?.documentType.replace(".", "_")}`,
                    documentType: document?.documentType,
                    documentUid: document?.documentUid,
                    fileStoreId: document?.fileStoreId,
                    status: document.status,
                  };
                }),
            },
          ],
        },
      },
    ];
  },
  applicationDetails: async (t, tenantId, applicationNumber, userType, args) => {
    const filter = { applicationNumber, ...args };
    const response = await PTRSearch.application(tenantId, filter);

    return {
      tenantId: response.tenantId,
      applicationDetails: PTRSearch.RegistrationDetails({ PetRegistrationApplications: response, t }),
      additionalDetails: response?.additionalDetails,
      applicationData: response,
      transformToAppDetailsForEmployee: PTRSearch.RegistrationDetails,
    };
  },
};
