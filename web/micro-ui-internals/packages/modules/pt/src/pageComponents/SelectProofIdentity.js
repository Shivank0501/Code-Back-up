import React, { useState, useEffect } from "react";
import { FormStep, UploadFile, CardLabelDesc, Dropdown, CardLabel } from "@egovernments/digit-ui-react-components";
import { stringReplaceAll } from "../utils";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";

const SelectPTRProof = ({ t, config, onSelect, userType, formData, ownerIndex = 0, addNewOwner }) => {
  const { pathname: url } = useLocation();
  // const editScreen = url.includes("/modify-application/");
  const isMutation = url.includes("property-mutation");

  let index = window.location.href.charAt(window.location.href.length - 1);
  // isMutation ? ownerIndex : window.location.href.charAt(window.location.href.length - 1);

  const [uploadedFile, setUploadedFile] = useState(() => formData?.owners[index]?.documents?.proofIdentity?.fileStoreId || null);
  const [file, setFile] = useState(formData?.owners[index]?.documents?.proofIdentity);
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const onSkip = () => onSelect();
  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;

  const [dropdownValue, setDropdownValue] = useState(formData?.owners[index]?.documents?.proofIdentity?.documentType);
  let dropdownData = [];
  const components_ar = []

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { isLoading, data } = Digit.Hooks.ptr.usePetMDMS(stateId, "PetService", "Documents");

  // const docs = Documentsob?.PropertyTax?.Documents;
  const PTRDocument = data?.PetService?.Documents.map(document => ({
    ...document,
    hasDropdown: true
  }));

  console.log("documenst ", data?.PetService?.Documents.map(document => ({
    ...document,
    hasDropdown: true
  })))
  console.log("PThmnfnenf", PTRDocument)

  const proofIdentity = Array.isArray(PTRDocument) && PTRDocument;
  for (let i = 0; i < 4; i++) {
  if (proofIdentity.length > 0) {
    dropdownData = proofIdentity[i]?.dropdownData;



    dropdownData.forEach((data) => {
      data.i18nKey = stringReplaceAll(data.code, ".", "_");
    });

  }


    components_ar.push(
      <div>
        <Dropdown
          t={t}
          isMandatory={false}
          option={dropdownData}
          selected={dropdownValue}
          optionKey="i18nKey"
          select={setTypeOfDropdownValue}
        />
        <UploadFile
          id={"pt-doc"}
          extraStyleName={"propertyCreate"}
          accept=".jpg,.png,.pdf"
          onUpload={selectfile}
          onDelete={() => {
            setUploadedFile(null);
          }}
          message={uploadedFile ? `1 ${t(`PT_ACTION_FILEUPLOADED`)}` : t(`PT_ACTION_NO_FILEUPLOADED`)}
          error={error}
        />
        <br/>


      </div>
    )
  }

  function setTypeOfDropdownValue(dropdownValue) {
    setDropdownValue(dropdownValue);
  }

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 2000000) {
          setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            // TODO: change module in file storage
            const response = await Digit.UploadServices.Filestorage("property-upload", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("PT_FILE_UPLOAD_ERROR"));
            }
          } catch (err) { }
        }
      }
    })();
  }, [file]);

  const [multipleownererror, setmultipleownererror] = useState(null);

  const handleSubmit = () => {
    setmultipleownererror(null);
    if (formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS" && formData?.owners?.length <= 1 && index == "0" && !isMutation) {
      setmultipleownererror("PT_MULTI_OWNER_ADD_ERR_MSG");
    } else if (isMutation && formData?.owners?.length <= 1 && formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS") {
      setmultipleownererror("PT_MULTI_OWNER_ADD_ERR_MSG");
    } else {
      let fileStoreId = uploadedFile;
      let fileDetails = file;
      if (fileDetails) {
        fileDetails.documentType = dropdownValue;
        fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
      }
      let ownerDetails = formData.owners && formData.owners[index];
      if (ownerDetails && ownerDetails.documents) {
        if (!isMutation) ownerDetails.documents["proofIdentity"] = fileDetails;
        else ownerDetails.documents["proofIdentity"] = { documentType: dropdownValue, fileStoreId };
      }
      //  else {

      //   if (!isMutation) {
      //     ownerDetails["documents"] = [];
      //     ownerDetails.documents["proofIdentity"] = fileDetails;
      //   } else {
      //     ownerDetails["documents"] = {};
      //     ownerDetails.documents["proofIdentity"] = { documentType: dropdownValue, fileStoreId };
      //   }
      // }

      onSelect(config.key, isMutation ? [ownerDetails] : ownerDetails, "", index);
    }
    // onSelect(config.key, { specialProofIdentity: fileDetails }, "", index);
  };

  function onAdd() {
    if (isMutation) {
      if (!uploadedFile || !dropdownValue) {
        setError(t("ERR_DEFAULT_INPUT_FIELD_MSG"));
        return;
      }
      let ownerDetails = formData.owners && formData.owners[index];
      if (ownerDetails && ownerDetails.documents) {
        ownerDetails.documents["proofIdentity"] = { documentType: dropdownValue, fileStoreId: uploadedFile };
      } else {
        ownerDetails["documents"] = {};
        ownerDetails.documents["proofIdentity"] = { documentType: dropdownValue, fileStoreId: uploadedFile };
      }
      addNewOwner(ownerDetails);
      return;
    }

    let newIndex = parseInt(index) + 1;
    let fileStoreId = uploadedFile;
    let fileDetails = file;
    if (fileDetails) {
      fileDetails.documentType = dropdownValue;
      fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    }
    let ownerDetails = formData.owners && formData.owners[index];
    if (ownerDetails && ownerDetails.documents) {
      ownerDetails.documents["proofIdentity"] = fileDetails;
    } else {
      ownerDetails["documents"] = [];
      ownerDetails.documents["proofIdentity"] = fileDetails;
    }
    onSelect("owner-details", {}, false, newIndex, true);
  }

  const checkMutatePT = window.location.href.includes("citizen/pt/property/property-mutation/") ? (
    <Timeline currentStep={1} flow="PT_MUTATE" />
  ) : (
    <Timeline currentStep={3} />
  );
  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? checkMutatePT : null}
      <FormStep
        t={t}
        config={config}
        onSelect={handleSubmit}
        onSkip={onSkip}
        forcedError={t(multipleownererror)}
        isDisabled={isUpdateProperty || isEditProperty ? false : multipleownererror || !uploadedFile || !dropdownValue || error}
        onAdd={onAdd}
        isMultipleAllow={formData?.ownershipCategory?.value == "INDIVIDUAL.MULTIPLEOWNERS"}
      >

        {components_ar}



        {error ? <div style={{ height: "20px", width: "100%", fontSize: "20px", color: "red", marginTop: "5px" }}>{error}</div> : ""}
        <div style={{ disabled: "true", height: "20px", width: "100%" }}></div>
      </FormStep>
    </React.Fragment>
  );
};

export default SelectPTRProof;
