import { mapObject } from './mapper';
import { mapObjectToSchema } from './schemaCreator';
import { extractExampleFromSchema } from './exampleRecordExtractor';

export {
    mapObject,
    mapObjectToSchema,
    extractExampleFromSchema,
}

// const aa = {
//     "evictionId" : 1836030810467466240.0, 
//     "bridge" : null, 
//     "defendantNames" : [
//         {
//             "isBusiness" : false, 
//             "tahoeId" : "G-575692654799887454", 
//             "ssn" : "099-66-2500", 
//             "prefix" : "", 
//             "firstName" : "MATTHEW", 
//             "middleName" : "", 
//             "lastName" : "ROSENBLUM", 
//             "suffix" : "", 
//             "gender" : "M", 
//             "nameHash" : 5682392457680976900.0, 
//             "addressHashOpt9" : 3396533295236144100.0, 
//             "fullName" : "MATTHEW ROSENBLUM", 
//             "address" : {
//                 "addressType" : "Defendant Address", 
//                 "addressHashOpt9" : 3396533295236144100.0, 
//                 "houseNumber" : "36", 
//                 "streetDirection" : "E", 
//                 "streetName" : "64th", 
//                 "streetType" : "ST", 
//                 "streetPostDirection" : "", 
//                 "unitType" : "", 
//                 "unitNumber" : "", 
//                 "city" : "New York", 
//                 "county" : "", 
//                 "state" : "NY", 
//                 "zipCode" : "10065", 
//                 "zip4" : "7371", 
//                 "longitude" : "", 
//                 "latitude" : "", 
//                 "fipsCode" : "", 
//                 "verificationCodes" : [
//                     "AC01", 
//                     "AE09", 
//                     "AS02"
//                 ], 
//                 "fullAddress" : "36 E 64th ST; New York, NY 10065-7371"
//             }, 
//             "partyType" : "Defendant"
//         },
//         {
//             "isBusiness" : false, 
//             "tahoeId" : "G-575692654799887454", 
//             "ssn" : "099-66-2500", 
//             "prefix" : "", 
//             "firstName" : "MATTHEW", 
//             "middleName" : "", 
//             "lastName" : "ROSENBLUM", 
//             "suffix" : "", 
//             "gender" : "M3", 
//             "nameHash" : 5682392457680976900.0, 
//             "addressHashOpt9" : 3396533295236144100.0, 
//             "fullName" : "MATTHEW ROSENBLUM3", 
//             "address" : {
//                 "addressType" : "Defendant Address", 
//                 "addressHashOpt9" : 3396533295236144100.0, 
//                 "houseNumber" : "36", 
//                 "streetDirection" : "E", 
//                 "streetName" : "64th", 
//                 "streetType" : "ST", 
//                 "streetPostDirection" : "", 
//                 "unitType" : "", 
//                 "unitNumber" : "", 
//                 "city" : "New York", 
//                 "county" : "", 
//                 "state" : "NY", 
//                 "zipCode" : "10065", 
//                 "zip4" : "7371", 
//                 "longitude" : "", 
//                 "latitude" : "", 
//                 "fipsCode" : "", 
//                 "verificationCodes" : [
//                     "AC01", 
//                     "AE09", 
//                     "AS02"
//                 ], 
//                 "fullAddress" : "36 E 64th ST; New York, NY 10065-7371"
//             }, 
//             "partyType" : "Defendant"
//         }
//     ], 
//     "plaintiffNames" : [
//         {
//             "isOwner" : true, 
//             "tahoeId" : null, 
//             "ssn" : null, 
//             "prefix" : "", 
//             "firstName" : "", 
//             "middleName" : "", 
//             "lastName" : "OKADA DENKI SAN LTD", 
//             "suffix" : "", 
//             "gender" : "N", 
//             "nameHash" : 1020963256723863680.0, 
//             "fullName" : "OKADA DENKI SAN LTD", 
//             "partyType" : "Defendant"
//         }
//     ], 
//     "addresses" : [
//         {
//             "addressType" : "Court Address", 
//             "addressHashOpt9" : -5893356457424657400.0, 
//             "houseNumber" : "111", 
//             "streetDirection" : "", 
//             "streetName" : "Centre", 
//             "streetType" : "ST", 
//             "streetPostDirection" : "", 
//             "unitType" : "Rm", 
//             "unitNumber" : "118", 
//             "city" : "New York", 
//             "county" : "New York", 
//             "state" : "NY", 
//             "zipCode" : "10013", 
//             "zip4" : "4390", 
//             "longitude" : "", 
//             "latitude" : "", 
//             "fipsCode" : "", 
//             "verificationCodes" : [
//                 "AC03", 
//                 "AE08", 
//                 "AS02"
//             ], 
//             "fullAddress" : "111 Centre ST, Rm 118; New York, NY 10013-4390"
//         }, 
//         {
//             "addressType" : "Defendant Address", 
//             "addressHashOpt9" : 3396533295236144100.0, 
//             "houseNumber" : "36", 
//             "streetDirection" : "E", 
//             "streetName" : "64th", 
//             "streetType" : "ST", 
//             "streetPostDirection" : "", 
//             "unitType" : "", 
//             "unitNumber" : "", 
//             "city" : "New York", 
//             "county" : "", 
//             "state" : "NY", 
//             "zipCode" : "10065", 
//             "zip4" : "7371", 
//             "longitude" : "", 
//             "latitude" : "", 
//             "fipsCode" : "", 
//             "verificationCodes" : [
//                 "AC01", 
//                 "AE09", 
//                 "AS02"
//             ], 
//             "fullAddress" : "36 E 64th ST; New York, NY 10065-7371"
//         }
//     ], 
//     "courts" : [
//         {
//             "type" : "court", 
//             "addressHashOpt9" : -5893356457424657400.0, 
//             "courtId" : "NYNEWL1", 
//             "courtName" : "Civil Court of the City of New York", 
//             "courtPhoneOne" : "6463865700", 
//             "courtPhoneOneExtension" : null, 
//             "courtPhoneTwo" : "6463865730", 
//             "fax" : "2123748053", 
//             "courtUrl" : "http://www.courts.state.ny.us/courts/1jd/index.shtml", 
//             "address" : {
//                 "addressType" : "Court Address", 
//                 "addressHashOpt9" : -5893356457424657400.0, 
//                 "houseNumber" : "111", 
//                 "streetDirection" : "", 
//                 "streetName" : "Centre", 
//                 "streetType" : "ST", 
//                 "streetPostDirection" : "", 
//                 "unitType" : "Rm", 
//                 "unitNumber" : "118", 
//                 "city" : "New York", 
//                 "county" : "New York", 
//                 "state" : "NY", 
//                 "zipCode" : "10013", 
//                 "zip4" : "4390", 
//                 "longitude" : "", 
//                 "latitude" : "", 
//                 "fipsCode" : "", 
//                 "verificationCodes" : [
//                     "AC03", 
//                     "AE08", 
//                     "AS02"
//                 ], 
//                 "fullAddress" : "111 Centre ST, Rm 118; New York, NY 10013-4390"
//             }
//         }
//     ], 
//     "evictionDetails" : [
//         {
//             "courtId" : "NYNEWL1", 
//             "caseNumber" : "20050071276", 
//             "fileDate" : "20050516", 
//             "liabilityAmount" : "000045000", 
//             "reportDate" : "20060824", 
//             "fileType" : "BN", 
//             "state" : "NY", 
//             "unlawfulDetainer" : "Y", 
//             "assetsInDollar" : "000000000", 
//             "updateDate" : ""
//         }
//     ]
// }

// const a = mapObject(
//     aa,
//     [
//         {
//             "source" : "defendantNames[].ssn", 
//             "target" : {
//                 "path" : "party[].identificationCard.number", 
//                 "predefinedTransformations" : [

//                 ], 
//             }, 
//         }, 
//         {
//             "source" : "defendantNames[].default", 
//             "target" : {
//                 "path" : "party[].identificationCard.type", 
//                 "defaultValue" : "SSN", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].firstName", 
//             "target" : {
//                 "path" : "party[].name.firstName", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].lastName", 
//             "target" : {
//                 "path" : "party[].name.lastName", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].gender", 
//             "target" : {
//                 "path" : "party[].sex", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].fullName", 
//             "target" : {
//                 "path" : "party[].name.full", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "defendantNames[].partyType", 
//             "target" : {
//                 "path" : "party[].type", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.houseNumber", 
//             "target" : {
//                 "path" : "party[].address.poBox", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.streetName", 
//             "target" : {
//                 "path" : "party[].address.street1", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.streetType", 
//             "target" : {
//                 "path" : "party[].address.street2", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.unitNumber", 
//             "target" : {
//                 "path" : "party[].address.apartment", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.city", 
//             "target" : {
//                 "path" : "party[].address.city", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.state", 
//             "target" : {
//                 "path" : "party[].address.state", 
//                 "predefinedTransformations" : [
//                 ]
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.zipCode", 
//             "target" : {
//                 "path" : "party[].address.zip", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.zip4", 
//             "target" : {
//                 "path" : "party[].address.zipExtension", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.fullAddress", 
//             "target" : {
//                 "path" : "party[].address.full", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.longitude", 
//             "target" : {
//                 "path" : "party[].address.longtitude", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "defendantNames[].address.latitude", 
//             "target" : {
//                 "path" : "party[].address.latitude", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "xplaintiffNames[].firstName", 
//             "target" : {
//                 "path" : "party[].name.firstName", 
//                 "predefinedTransformations" : [

//                 ], 
//             }
//         }, 
//         {
//             "source" : "xplaintiffNames[].lastName", 
//             "target" : {
//                 "path" : "party[].name.lastName", 
//                 "predefinedTransformations" : [

//                 ] 
//             }
//         }, 
//         {
//             "source" : "xplaintiffNames[].gender", 
//             "target" : {
//                 "path" : "party[].sex", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "xplaintiffNames[].fullName", 
//             "target" : {
//                 "path" : "party[].name.full", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "xplaintiffNames[].partyType", 
//             "target" : {
//                 "path" : "party[].type", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "courts.0.courtName", 
//             "target" : {
//                 "path" : "courtName", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "courts.0.courtName", 
//             "target" : {
//                 "path" : "legalSource.name", 
//                 "predefinedTransformations" : [

//                 ] 
//             }
//         }, 
//         {
//             "source" : "courts.0.courtUrl", 
//             "target" : {
//                 "path" : "legalSource.link", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "courts.0.address.county", 
//             "target" : {
//                 "path" : "legalSource.county", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "courts.0.address.state", 
//             "target" : {
//                 "path" : "legalSource.state", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "evictionDetails.0.caseNumber", 
//             "target" : {
//                 "path" : "caseNum", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "evictionDetails.0.fileDate", 
//             "target" : {
//                 "path" : "filingDate", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "evictionDetails.0.liabilityAmount", 
//             "target" : {
//                 "path" : "lawsuitAmount", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "evictionDetails.0.reportDate", 
//             "target" : {
//                 "path" : "legalSource.publicationDate", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "default", 
//             "target" : {
//                 "path" : "caseCategory", 
//                 "defaultValue" : "UNLAWFUL_DETAINER", 
//                 "predefinedTransformations" : [

//                 ]
//             }
//         }, 
//         {
//             "source" : "default", 
//             "target" : {
//                 "path" : "caseType", 
//                 "defaultValue" : "CIVIL", 
//                 "predefinedTransformations" : [

//                 ]
//             }, 
//         }, 
//         {
//             "source" : "default", 
//             "target" : {
//                 "path" : "courtType", 
//                 "defaultValue" : "COUNTY", 
//                 "predefinedTransformations" : [

//                 ]
//             }, 
//         }
//     ]
// )

// console.log(JSON.stringify(a, null, 2));
