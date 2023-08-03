export enum ApiEndpointType {
  // USER API //
  CreateInviteUserProfile = '/api/user/CreateInviteUserProfile',
  CreateInviteUserNameProfile = '/api/user/CreateInviteUserNameProfile',
  InviteViaEmail = '/api/user/InviteViaEmail',
  GetOverDueCount = '/api/user/GetOverDueCourseCount',
  GetUserStat = '/api/user/getUserStat',

  GetAllCompanyAdminUsers = '/api/user/GetAllCompanyAdminUsers',
  GetAllUserswithPaging= '/api/user/GetAllUserswithPaging',
  GetAllUserswithPagingCalibration= '/api/user/GetAllUserswithPagingCalibration',
  GetAllCompanyAdminUserswithPagingAndFilters = '/api/user/GetAllCompanyAdminUserswithPagingAndFilters',
  GetUserDetailById = '/api/user/GetUserDetailById',
  GetTotalLicenses = '/api/user/GetTotalLicenses',
  GetUsersList = '/api/user/getUsersList',
  getUsersListAccordingRole= '/api/user/getUsersListAccordingRole',
  GetCompanyUsers= '/api/user/getCompanies',
  GetUserDetailByEmail= '/api/user/GetUserDetailByEmail',
  GetTestTaken ='/api/user/getTestTaken',
  RemoveAdminRights = '/api/user/RemoveAdminRights',
  AddCompanyAdmins = '/api/user/AddCompanyAdmins',
  ResendEmailInvitation = '/api/user/ResendEmailInvitation',
  GetCompanyStat = '/api/user/GetCompanyStat',
  SaveUserLanguagePrefernce = '/api/user/SaveUserLanguagePrefernce',
  GetDueOverDue = '/api/user/GetDueOverDue',
  UpdateUserDetail = '/api/user/UpdateUserDetail',
  deleteUserCredentials = '/api/UserCredentials/deleteUserCredentials',
  GetCredentialTypeSelectList = '/api/dropdown/GetCredentialTypeSelectList',
  GetUserCourseHistoriesByUser = '/api/usercoursehistories/GetUserCourseHistoriesByUser',
  GetUserCredentialsByUser = '/api/usercredentials/GetUserCredentialsByUser',
  GetAdminCompaniesStats = '/api/User/getAdminCompaniesStats',
  AccoutPrivillegesUsers = '/api/user/AccoutPrivillegesUserList',
  UpdatePassword = '/api/user/UpdatePassword',
  GaugeRecordsInfo ='/api/Gauge/GetCompanyGauge',
  GetGaugeLogs ='/api/Gauge/GetGaugeLogs',
  UpdateFrequancyOfEmailNoti  ='/api/Gauge/UpdateFrequancyOfEmailNoti',
  SaveDocumentCustomType ='/api/Gauge/SaveDocumentCustomType',
  GetCompanyGaugeWithFilter='/api/Gauge/GetCompanyGaugeWithFilter',
  GetHistoryGaugeWithFilter='/api/Gauge/GetHistoryGaugeWithFilter',
  GetListofGaugeAccordingStatus ='/api/Gauge/GetListofGaugeAccordingStatus',
  getListofGaugeAccordingStatusWithMultipleSelect ='/api/Gauge/getListofGaugeAccordingStatusWithMultipleSelect',

  AddSupplier ='/api/Gauge/AddSuuplier',
  GetSupplierList ='/api/Gauge/GetSupplierList',
  GetSupplierListWithoutUser ='/api/Gauge/GetSupplierListWithoutUser',

  DeleteUserTrainingPlans= '/api/usertrainingplans/DeleteUserTrainingPlans',
  AddUserTrainingPlans= '/api/usertrainingplans/AddUserTrainingPlans',

  SaveGaugeLogs ='/api/Gauge/SaveGaugeLogs',
  DeleteSupplier ='/api/Gauge/DeleteSupplier',
  DeleteGaugeSupplier ='/api/Gauge/DeleteGaugeSupplier',
  deleteGaugePermanently ='/api/Gauge/deleteGaugePermanently',

  GetCompanyCoursesById='/api/companycourse/GetCompanyCoursesById',

  VerifyCompanyAdminEmail ='/api/companycourse/VerifyCompanyAdminEmail',
  ShareCustomCourses= '/api/companycourse/ShareCustomCourses',
  GetCustomCertificate='/api/customcertificate/GetCustomCertificate',
  GetCustomCertificateById='/api/customcertificate/GetCustomCertificateById',
  DeleteCustomCertificate='/api/customcertificate/DeleteCustomCertificate',
  GetCustomCertificateList ='/api/customcertificate/GetCustomCertificateList',
  previewcertificateById ='/api/customcertificate/previewcertificateById',

  GetUserTestStatusByCompanyCourse='/api/usertests/GetUserTestStatusByCompanyCourse',

  GetListofGaugeAccordingStatusWithDate ='/api/Gauge/GetListofGaugeAccordingStatusWithDate',
UpdateUser='/api/user/UpdateUser',

  //DROPDOWN API //
  GetUserStatusSelectList = '/api/dropdown/GetUserStatusSelectList',
  GetFrequencySelectList = '/api/dropdown/GetFrequencySelectList',
  GetFrequencySelectListByCompanyId = '/api/dropdown/GetFrequencySelectListByCompanyId',
  GetCompanyCourseActiveInActiveSelectList = '/api/dropdown/GetCompanyCourseActiveInActiveSelectList',
  GetAllCompanyUsers = '/api/user/GetAllCompanyUsers',
  GetRoleSelectList = '/api/dropdown/GetRoleSelectList',
  GetCompanySelectList = '/api/dropdown/GetCompanySelectList',
  GetDepartmentSelectListByCompany = '/api/dropdown/GetDepartmentSelectListByCompany',
  SaveUserDetails = '/api/user/saveUserDetails',
  AddUserCredentials = '/api/usercredentials/AddUserCredentials',
  updateUserCredentials = '/api/usercredentials/updateUserCredentials',
  GetGaugeStatusList = '/api/Gauge/Status',
  GetStandardSelectList = '/api/Gauge/Standard',
  GetOwnerSelectList = '/api/Gauge/Owner',
  GetManufacturerSelectList = '/api/Gauge/Manufacturer',
  GetLocationSelectList = '/api/Gauge/Location',
  GetTestQuestionSelectList = '/api/dropdown/GetTestQuestionSelectList',
  GetInvitedUser = '/api/user/GetInviteUserById',
  UpdateInviteUserProfile = '/api/user/UpdateInviteUserProfile',
  RegisterUser ='/api/user/RegisterUser',
  //COMPANIES API //
  GetCompaniesWithoutSubscription = '/api/companies/GetCompaniesWithoutSubscription',
  GetCompanyByUser = '/api/companies/GetCompanyByUser',
  GetCompanyByUserMainPage = '/api/companies/GetCompanyByUserMainPage',
  GetCompanyCourses = '/api/companycourse/GetCompanyCourses',
  GetCompanyCustomCourses = '/api/companycourse/GetCompanyCustomCourses',
  GetCompanyDepartmentCourses = '/api/companydepartmentcourses/GetCompanyDepartmentCourses',
  GetCompanyDepartments = '/api/companydepartments/GetCompanyDepartments',
  Companydepartmentcourses = '/api/companydepartmentcourses/CompanyDepartmentCourses',
  CompanydepartmentcoursesDelete = '/api/companydepartmentcourses',
  DownloadCompanyAdminUserCourseTraningMatrixReport = '/api/usercredentials/DownloadCompanyAdminUserCourseTraningMatrixReport',
  DownloadCompanyAdminUserAMTAwardsReport = '/api/usercredentials/DownloadCompanyAdminUserAMTAwardsReport',
  GetAllCompanyAdmins = '/api/user/GetAllCompanyAdmins',
  Companies = '/api/companies/UpdateCompany',
  lockUserCredentialsAndProfile = '/api/companies/lockUserCredentialsAndProfile',
  CompanyCoursesUpdate = '/api/CompanyCourse/CompanyCoursesUpdate',
  DeleteCompanyCourses = '/api/CompanyCourse/DeleteCompanyCourses',
  SaveCompanyDepartments = '/api/companydepartments/SaveCompanyDepartments',
  UpdateCompanyDepartments = '/api/companydepartments/UpdateCompanyDepartments',

  AddCompanies = '/api/Companies/AddCompanies',
  UpdateCompany = '/api/Companies/UpdateCompany',
  DeleteCompaniesWithInActive = '/api/Companies/UpdateCompany',
  DeleteCompaniesWithInActive2 = '/api/Companies/DeleteCompaniesWithInActive',
  DeleteCompany = '/api/Companies/DeleteCompany',
  SwitchCustomCoursesCreator = '/api/Companies/SwitchCustomCoursesCreator',

  SwitchpurchasedSupplierPro = '/api/Companies/SwitchpurchasedSupplierPro',
  SwitchpurchasedTraining = '/api/Companies/SwitchpurchasedTraining',
  SwitchpurchasedCalibration = '/api/Companies/SwitchpurchasedCalibration',
  SwitchpurchasedCalibrationEnterprise = '/api/Companies/SwitchpurchasedCalibrationEnterprise',
  SwitchpurchasedSpanishLanguageCourse = '/api/Companies/SwitchpurchasedSpanishLanguageCourse',

  //departments api
  CompanyDepartments = '/api/CompanyDepartments/DeleteCompanyDepartments',
  GetAllUsersList = '/api/user/UserList',
  GetAllActiveInactiveCourses = '/api/dropdown/GetCompanyCourseActiveInActiveSelectList',
  GetCompanies = '/api/Companies/GetCompanies/',

  //usertrainingplans
  GetAllUpcomingUserTrainingPlanByUser = '/api/usertrainingplans/GetAllUpcomingUserTrainingPlanByUser',
  GetAllUserTrainingPlanByFrequencyAndUser = '/api/usertrainingplans/GetAllUserTrainingPlanByFrequencyAndUser',

  //frequancy
  GetFrequencies = '/api/frequency/GetFrequencies',

  //Courses Api
  SaveCourses = '/api/Courses/PostCourse',
  GetAllCourses = '/api/Courses/Courses',
  GetCoursesList = '/api/Courses/GetCoursesList',
  GetCourseSelectList = '/api​/Dropdown​/GetCourseSelectList',
  GetCustomCourseSelectList='/api/dropdown/GetCustomCourseSelectList',
  CustomCoursesPagination ='/api/Courses/CustomCoursesPagination',
  CustomCourses ='/api/Courses/CustomCourses',
  MakeCertificateDefault='/api/CustomCertificate/MakeCertificateDefault',
  AssignCertificateToCustomCourse='/api/CustomCertificate/AssignCertificateToCustomCourse',


  //download documents
  DownloadAllUserCredentialDocument = '/api/usercredentials/DownloadAllUserCredentialDocument',
  DownloadUserCredentialDocument = '/api/usercredentials/DownloadUserCredentialDocument',

  //TestApi
  GetTests = '/api/Tests/Tests',
  GetTestsQuestions = '/api/TestQuestions/GetTestQuestions',
  GetTestQuestionAnswers = '/api/TestQuestionAnswers/GetTestQuestionAnswers',
  GetTestSelectList = '/api/dropdown/GetTestSelectList',


  //files
  saveFiles = '/api/Upload/save',
  saveimageurl = '/api/upload/saveimageurl',
  SaveSignature = '/api/upload/SaveSignature',
  RemoveHandout = '/api/upload/removehandout',
  RemoveGaugeDocument = '/api/upload/removegaugedocument',
  RemoveCredential = '/api/upload/removecredential',
  DownloadHandout = '/api/upload/DownloadCourseHandoutDocument',
  DownloadFile = '/api/upload/DownloadFile',
  DownloadFileFromCourseImages = '/api/upload/DownloadFileFromCourseImages',
  savehandoutdocument = '/api/upload/savehandoutdocument',
  UploadVideo = '/api/upload/UploadVideo',

  UpdateAnswer ='/api/TestQuestionAnswers/UpdateAnswer',

  //Courses
  GetCourseByID = '/api/courses/GetCourseByID',
  GetAllTestQuestionByCompanyCourse= '/api/testquestions/GetAllTestQuestionByCompanyCourse',
  SyncToExsafety= '/api/companycourse/SyncToExSafety',

  //Gauge
  GetGaugeStatusSelectList = '/api/Gauge/Status',
  GetGaugeOwnerSelectList = '/api/Gauge/Owner',
  GetGaugeStandardSelectList = '/api/Gauge/Standard',
  GetGaugeManufacturerSelectList = '/api/Gauge/Manufacturer',
  GetGaugeLocationSelectList = '/api/Gauge/Location',
  GetGaugeData = '/api/Gauge',
  AddGauge = '/api/Gauge/AddUpdateGauge',
  CheckDuplicateGaugeId = '/api/Gauge/CheckDuplicateGaugeId',
  DocumentType = '/api/Gauge/DocumentType',
  SaveDocumentType = '/api/Gauge/SaveDocumentType',
  SaveDocumentTypes = '/api/Gauge/SaveDocumentTypes',

  GetAllDocuments = '/api/Gauge/getAllDocuments',
  GaugeDownloadAllDocuments = '/api/Gauge/DownloadAllDocuments',
  DeleteDocuments = '/api/Gauge/DeleteDocuments',
  DeleteDocumentsPermanantly = '/api/Gauge/DeleteDocumentsPermanantly',

  GaugeCount = '/api/Gauge/gaugeCount',
  GaugeCountWithId = '/api/Gauge/gaugeCountWithId',

  GetArrayOfGauges = '/api/Gauge/getArrayOfGauges',
  GetArrayOfGaugesIds = '/api/Gauge/getArrayOfGaugesIds',
  GetCompanyOverDueGauge ='/api/Gauge/GetCompanyOverDueGauge',
  GetGaugesList ='/api/Gauge/GetGaugesList',
  SearchGauge = '/api/Gauge/searchGauge',
  GetGaugesByArrow='/api/Gauge/getGaugesByArrow',
  GetSupplier='/api/Gauge/GetSupplier',
  GetGaugesListByStatus ='/api/Gauge/GetGaugesListByStatus',
  UpdateUserTrainingPlanNextDueDateOverride='/api/usertrainingplans/UpdateUserTrainingPlanNextDueDateOverride',

  //e-learning
  GetELearning = '/api/elearnings/GetELearning',
  UpdateELearning = '/api/elearnings/UpdateELearning',
  SaveTests = '/api/Tests/SaveTests',
  SaveTestsWithQuestion = '/api/Tests/SaveTestsWithQuestion',

  UpadateTests = '/api/Tests/UpadateTests',
  Testquestions = '/api/TestQuestions/SaveTestQuestions',
  UpdateTestQuestions = '/api/TestQuestions/UpdateTestQuestions',
  //Gauge Status Api
  GaugeStatusDelete = '/api/gauge/DeleteGaugeStatus',
  GaugeOwnerDelete = '/api/gauge/DeleteGaugeOwner',
  GaugeStandardDelete = '/api/gauge/DeleteGaugeStandard',
  GaugeManufactureDelete = '/api/gauge/DeleteGaugeManufacturer',
  GaugeLocationDelete = '/api/gauge/DeleteGaugeLocation',
  GaugeStatusUpdate = '/api/gauge/AddUpdateGaugeStatus',
  GaugeStandardUpdate = '/api/gauge/AddUpdateGaugeStandard',
  GaugemnfUpdate = '/api/gauge/AddUpdateGaugeManufacturer',
  AddUpdateGaugeSupplier= '/api/gauge/AddUpdateGaugeSupplier',
  GaugeOwnerUpdate = '/api/gauge/AddUpdateGaugeOwner',
  GaugeLocationUpdate = '/api/gauge/AddUpdateGaugeLocation',
  GaugeLastRecord = '/api/gauge/LastGaugeRecord',
  AcountPrivilleges = '/api/gauge/AcountPrivilleges',
  GetGaugeDueIn = '/api/gauge/GetGaugeDueIn',
  UpdateGaugedue = '/api/gauge/UpdateGaugedue',
  customCoursesTestForTree='/api/Tests/customCoursesTestForTree',
  CustomCoursesTestForTreeForCreator='/api/Tests/CustomCoursesTestForTreeForCreator',


  //testing question and ans
  AddTestQuestionAnswers = '/api/TestQuestionAnswers/AddTestQuestionAnswers',
  DeleteQuestionAnswers = '/api/TestQuestionAnswers/DeleteQuestionAnswers',
  DeleteTestQuestions = '/api/TestQuestions/DeleteTestQuestions',
  UpdateTestQuestionAnswers = '/api/TestQuestionAnswers/UpdateTestQuestionAnswers',
  DeleteTests = '/api/Tests/DeleteTests',
  DeleteCourses = '/api/Courses/DeleteCourses',
  AddCourses = '/api/Courses/AddCourses',
  UpdateCourses = '/api/Courses/UpdateCourses',

  //aboutUs
  GetListUsersAboutUs = '/api/AboutUs/GetListUsersAboutUs',
  UpdateAboutUs = '/api/AboutUs/UpdateAboutUs',
  DeleteAboutUs = '/api/AboutUs/DeleteAboutUs',
  AddAboutUs = '/api/AboutUs/AddAboutUs',
  GetListUsersAboutUsFrontEnd = '/api/AboutUs/GetListUsersAboutUsFrontEnd',

  //UsersHistory
  GetListUsersHistory = '/api/UserHistory/GetListUsersHistory',
  DeleteAccoutPrivillegesUsers = '/api/user/DeleteUser',
  RecoverUser = '/api/user/RecoverUser',

  GetGaugeHistory = '/api/Gauge/History',
  AccoutPrivillegesUsersUpdate = '/api/user/UpdateuserDetails',

  //purchase
  CreateCheckoutSessionAsync ='/api/payment/CreateCheckoutSessionAsync',
  NewSubscription ='/api/payment/NewSubscription',
  Checkout ='/api/payment/CheckoutSuccessSessionAsync',

  //logo
  AddLogo ='/api/customcertificate/addlogo',
  AssignOneCertificateToAll='/api/customcertificate/AssignOneCertificateToAll',
  addsignatureone ='/api/customcertificate/addsignatureone',
  addcertificatenote ='/api/customcertificate/addcertificatenote',
  addsignaturetwo ='/api/customcertificate/addsignaturetwo',
  saveusertest='/api/usertests/saveusertest',
  deleteGauge='/api/Gauge/deleteGauge',
  TestById ='/api/tests/testbyId',
  //contact
  GetContact = '/api/contactus/GetContact',
  UpdateContact = '/api/contactus/UpdateContact',

  //terms of use and privacy policy
  GetTermsOfUse = '/api/termsprivacypolicy/GetTermsOfUse',
  GetPrivacyPolicy = '/api/termsprivacypolicy/GetPrivacyPolicy',
  GetHome = '/api/termsprivacypolicy/GetHome',
  UpdateHome = '/api/termsprivacypolicy/UpdateHomeTermsPrivacyPolicy',
  GetCalibration = '/api/termsprivacypolicy/GetCalibration',
  UpdateCalibration = '/api/termsprivacypolicy/UpdateCalibration',

  //tests
  UpdateTestQuestionsWithChange='/api/tests/UpdateTestQuestions',
  UpdateTestQuestionsText='/api/TestQuestions/UpdateTestQuestionsWithChange',
  UpdateTestQuestionsAnswersWithChange='/api/TestQuestionAnswers/UpdateTestQuestionsAnswersWithChange',

  GetUserStatus='/api/user/GetUserStatus',
  //navigation

  NavigateToDashboard= '/api/Authorize/NavigateToDashboard',
  Impersonate = '/api/Authorize/impersonate',
  ResetPassword = '/api/Authorize/resetPassword',
  ChangePassword = '/api/Authorize/changePassword',
  Token = '/api/Authorize/token',
  AuthorizeUser = '/api/Authorize/user',
}
