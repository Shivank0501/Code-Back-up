export const filterFunctions = {
  PT: (filtersArg) => {
    let { uuid } = Digit.UserService.getUser()?.info || {};

    const searchFilters = {};
    const workflowFilters = {};

    const { applicationNumber, mobileNumber, limit, offset, sortBy, sortOrder, total, applicationStatus, services } = filtersArg || {};

    if (filtersArg?.applicationNumber) {
      searchFilters.applicationNumber = filtersArg?.applicationNumber;
    }
    if (filtersArg?.applicationNumber) {
      searchFilters.applicationNumber = applicationNumber;
    }
    if (filtersArg?.oldapplicationNumber) {
      searchFilters.oldapplicationNumber = filtersArg?.oldapplicationNumber;
    }
    if (applicationStatus && applicationStatus?.[0]) {
      workflowFilters.applicationStatus = applicationStatus.map((status) => status.code).join(",");
    }
    if (filtersArg?.locality?.length) {
      searchFilters.locality = filtersArg?.locality.map((item) => item.code.split("_").pop()).join(",");
    }

    if (filtersArg?.locality?.code) {
      searchFilters.locality = filtersArg?.locality?.code;
    }

    if (filtersArg?.uuid && filtersArg?.uuid.code === "ASSIGNED_TO_ME") {
      workflowFilters.assignee = uuid;
    }
    if (mobileNumber) {
      searchFilters.mobileNumber = mobileNumber;
    }
    if (applicationNumber) {
      searchFilters.applicationNumber = applicationNumber;
    }
    if (sortBy) {
      searchFilters.sortBy = sortBy;
    }
    if (sortOrder) {
      searchFilters.sortOrder = sortOrder;
    }
    if (services) {
      workflowFilters.businessServices = services.join();
    }
    if (limit) {
      searchFilters.limit = limit;
    }
    if (offset) {
      searchFilters.offset = offset;
    }

    return { searchFilters, workflowFilters };
  },
  TL: (filtersArg) => {
    let { uuid } = Digit.UserService.getUser()?.info || {};

    const searchFilters = {};
    const workflowFilters = {};

    const { applicationNumber, mobileNumber, limit, offset, sortBy, sortOrder, total, applicationStatus, services } = filtersArg || {};

    if (filtersArg?.applicationNumber) {
      searchFilters.applicationNumber = filtersArg?.applicationNumber;
    }
    if (filtersArg?.applicationNumber) {
      searchFilters.applicationNumber = applicationNumber;
    }
    if (filtersArg?.oldapplicationNumber) {
      searchFilters.oldapplicationNumber = filtersArg?.oldapplicationNumber;
    }
    if (applicationStatus && applicationStatus?.[0]) {
      workflowFilters.applicationStatus = applicationStatus.map((status) => status.code).join(",");
    }
    if (filtersArg?.locality?.length) {
      searchFilters.locality = filtersArg?.locality.map((item) => item.code.split("_").pop()).join(",");
    }

    if (filtersArg?.uuid && filtersArg?.uuid.code === "ASSIGNED_TO_ME") {
      workflowFilters.assignee = uuid;
    }
    if (mobileNumber) {
      searchFilters.mobileNumber = mobileNumber;
    }
    if (applicationNumber) {
      searchFilters.applicationNumber = applicationNumber;
    }
    if (sortBy) {
      searchFilters.sortBy = sortBy;
    }
    if (sortOrder) {
      searchFilters.sortOrder = sortOrder;
    }
    if (services) {
      workflowFilters.businessServices = services.join();
    }
    if (limit) {
      searchFilters.limit = limit;
    }
    if (offset) {
      searchFilters.offset = offset;
    }

    return { searchFilters, workflowFilters };
  },

  /* @author for PTR- Shivank Shukla
  
  this filter file  as well as new filter file is just for the filter feature in inbox search 
  */
  PTR: (filtersArg) => {
    let { uuid } = Digit.UserService.getUser()?.info || {};

    const searchFilters = {};
    const workflowFilters = {};

    const { applicationNumber, mobileNumber, limit, offset, sortBy, sortOrder, total, applicationStatus, services } = filtersArg || {};

    if (filtersArg?.applicationNumber) {
      searchFilters.applicationNumber = filtersArg?.applicationNumber;
    }
    if (filtersArg?.applicationNumber) {
      searchFilters.applicationNumber = applicationNumber;
    }
    if (filtersArg?.oldapplicationNumber) {
      searchFilters.oldapplicationNumber = filtersArg?.oldapplicationNumber;
    }
    if (applicationStatus && applicationStatus?.[0]) {
      workflowFilters.applicationStatus = applicationStatus.map((status) => status.code).join(",");
    }
    if (filtersArg?.locality?.length) {
      searchFilters.locality = filtersArg?.locality.map((item) => item.code.split("_").pop()).join(",");
    }

    if (filtersArg?.locality?.code) {
      searchFilters.locality = filtersArg?.locality?.code;
    }

    if (filtersArg?.uuid && filtersArg?.uuid.code === "ASSIGNED_TO_ME") {
      workflowFilters.assignee = uuid;
    }
    if (mobileNumber) {
      searchFilters.mobileNumber = mobileNumber;
    }
    if (applicationNumber) {
      searchFilters.applicationNumber = applicationNumber;
    }
    if (sortBy) {
      searchFilters.sortBy = sortBy;
    }
    if (sortOrder) {
      searchFilters.sortOrder = sortOrder;
    }
    if (services) {
      workflowFilters.businessServices = services.join();
    }
    if (limit) {
      searchFilters.limit = limit;
    }
    if (offset) {
      searchFilters.offset = offset;
    }

    return { searchFilters, workflowFilters };
  },
};
