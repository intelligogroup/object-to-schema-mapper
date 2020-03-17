import { mapObject } from './mapper';
import { mapObjectToSchema } from './schemaCreator';
import { extractExampleFromSchema } from './exampleRecordExtractor';

export {
    mapObject,
    mapObjectToSchema,
    extractExampleFromSchema,
}

const aa = { "Resume": { "@xml:lang": "en", "@xmlns": "http://ns.hr-xml.org/2006-02-28", "@xmlns:sov": "http://sovren.com/hr-xml/2006-02-28", "ResumeId": { "IdValue": "unknown type and data" }, "StructuredXMLResume": { "ContactInfo": { "PersonName": { "FormattedName": "NURIT GUN", "GivenName": "NURIT", "FamilyName": "GUN" }, "ContactMethod": [{ "Telephone": { "FormattedNumber": "052-7208584" }, "Use": "personal", "Location": "onPerson", "WhenAvailable": "anytime", "InternetEmailAddress": "gnurit124@gmail.com" }] }, "ExecutiveSummary": "Enthusiastic Data and Research Analyst and dedicated employee with high integrity, strong work ethic and\r\ngreat analytical skills.", "EmploymentHistory": { "EmployerOrg": [{ "EmployerOrgName": "Madlan", "PositionHistory": [{ "@positionType": "directHire", "Title": "Research Analyst", "OrgName": { "OrganizationName": "Madlan" }, "OrgInfo": [{ "PositionLocation": { "CountryCode": "IL", "Municipality": "Tel Aviv" } }], "Description": "● Analyzed statistical data using both modern and traditional methods.\r\n● Collected data on competitors, consumers and marketplace and consolidated data into presentations and reports.\r\n● Interpreted data and made recommendations from findings.\r\n● Validated incoming data to check accuracy and integrity of information while independently locating and correcting concerns.\r\n● Gathered, arranged and corrected research data to create representative graphs and charts highlighting\r\nresults for presentations.\r\n● Created site-specific insights for residential areas, through analyzing municipal and governmental databases, as well as defining relevant measurable metrics.", "StartDate": { "YearMonth": "2017-02" }, "EndDate": { "YearMonth": "2019-03" }, "JobCategory": [{ "TaxonomyName": "Skills taxonomy", "CategoryCode": "Engineering → Civil", "Comments": "Engineering describes 25% of this job" }], "UserArea": { "sov:PositionHistoryUserArea": { "sov:Id": "POS-1", "sov:CompanyNameProbabilityInterpretation": { "@internalUseOnly": "BB", "#text": "Confident" }, "sov:PositionTitleProbabilityInterpretation": { "@internalUseOnly": "SS", "#text": "Confident" }, "sov:NormalizedOrganizationName": "Madlan", "sov:NormalizedTitle": "Research Analyst" } } }], "UserArea": { "sov:EmployerOrgUserArea": { "sov:NormalizedEmployerOrgName": "Madlan" } } }] }, "EducationHistory": { "SchoolOrInstitution": [{ "@schoolType": "college", "School": [{ "SchoolName": "Naya College" }], "Degree": [{ "DegreeMajor": [{ "Name": ["Geography and Political Scince"] }], "DatesOfAttendance": [{ "StartDate": { "AnyDate": "notKnown" }, "EndDate": { "YearMonth": "2020-04" } }], "Comments": "Data Analysis: Data analyst expert\t04/2020\r\nNaya College\r\n\r\n\r\nGeography and Political Scince: Geoinformatics", "UserArea": { "sov:DegreeUserArea": { "sov:Id": "DEG-1", "sov:Graduated": "false" } } }], "UserArea": { "sov:SchoolOrInstitutionTypeUserArea": { "sov:NormalizedSchoolName": "Naya College" } } }] }, "Qualifications": { "QualificationSummary": "SKILLS\r\n\r\n\r\n●   Data collection and analysis\t●   Organized\r\n●   High attention to detail\t●   Multi-tasking\r\n●   Strong analytical skills\t●   SQL and databases\r\n●   Excellent communication abilities\t●   Pivot Tables\r\n●   Methodical" }, "Languages": { "Language": [{ "LanguageCode": "en", "Read": "true", "Write": "true", "Speak": "true", "Comments": "[RESUME_LANGUAGE]" }] }, "RevisionDate": "2020-03-15", "Achievements": { "Achievement": [{ "Description": "honor of being able to manage a discrete area of work within restoration of new\tConservation" }] }, "LicensesAndCertifications": { "LicenseOrCertification": [{ "Name": "Certified Tester", "Id": "1", "Description": "certification; matched to list" }] } }, "NonXMLResume": { "TextResume": "NURIT GUN\r\n052-7208584 • gnurit124@gmail.com • LinkedIn\r\n\r\n\r\nPROFESSIONAL SUMMARY\r\n\r\nEnthusiastic Data and Research Analyst and dedicated employee with high integrity, strong work ethic and\r\ngreat analytical skills.\r\n\r\n\r\nSKILLS\r\n\r\n\r\n●   Data collection and analysis\t●   Organized\r\n●   High attention to detail\t●   Multi-tasking\r\n●   Strong analytical skills\t●   SQL and databases\r\n●   Excellent communication abilities\t●   Pivot Tables\r\n●   Methodical\r\n\r\n\r\nWORK HISTORY\r\n\r\n\r\nResearch Analyst\r\n\r\nMadlan - Tel Aviv, Israel\t02/2017 - 03/2019\r\n● Analyzed statistical data using both modern and traditional methods.\r\n● Collected data on competitors, consumers and marketplace and consolidated data into presentations and\r\nreports.\r\n● Interpreted data and made recommendations from findings.\r\n● Validated incoming data to check accuracy and integrity of information while independently locating and\r\ncorrecting concerns.\r\n● Gathered, arranged and corrected research data to create representative graphs and charts highlighting\r\nresults for presentations.\r\n● Created site-specific insights for residential areas, through analyzing municipal and\r\ngovernmental databases, as well as defining relevant measurable metrics.\r\n\r\n\r\nEDUCATION\r\n\r\n\r\nData Analysis: Data analyst expert\t04/2020\r\nNaya College\r\n\r\n\r\nGeography and Political Scince: Geoinformatics\r\nTel Aviv University\t01/2019" }, "UserArea": { "sov:ResumeUserArea": { "sov:Culture": { "sov:Language": "en", "sov:Country": "US", "sov:CultureInfo": "en-US" }, "sov:ExperienceSummary": { "sov:Description": "NURIT GUN's experience appears to be somewhat concentrated in Information Technology (mostly Database) and somewhat concentrated in Business Operations and General Business (mostly General Skills and Activities). NURIT GUN's experience appears to be lower-to-mid level, with about 2 years of experience.", "sov:MonthsOfWorkExperience": "25", "sov:AverageMonthsPerEmployer": "25", "sov:FulltimeDirectHirePredictiveIndex": "85", "sov:MonthsOfManagementExperience": "0", "sov:HighestManagementScore": "0", "sov:ExecutiveType": "none", "sov:ManagementStory": "unknown type and data", "sov:SkillsTaxonomyOutput": { "sov:TaxonomyRoot": [{ "@name": "Sovren", "sov:Taxonomy": [{ "@name": "Information Technology", "@id": "10", "@percentOfOverall": "44", "sov:Subtaxonomy": [{ "@name": "Database", "@id": "193", "@percentOfOverall": "28", "@percentOfParentTaxonomy": "64", "sov:Skill": [{ "@name": "DATA ANALYSIS", "@id": "014961", "@existsInText": "true", "@lastUsed": "2020-04-01", "@whereFound": "Found in EDUCATION; DEG-1" }] }] }] }] } }, "sov:Sections": { "sov:Section": [{ "@starts": "4", "@ends": "9", "@sectionType": "SUMMARY", "#text": "PROFESSIONAL SUMMARY" }] }, "sov:ReservedData": { "sov:Phones": { "sov:Phone": ["052-7208584"] }, "sov:Names": { "sov:Name": ["NURIT GUN"] }, "sov:EmailAddresses": { "sov:EmailAddress": ["gnurit124@gmail.com"] }, "sov:Urls": { "sov:Url": ["http://www.linkedin.com/pub/maryna"] } }, "sov:ParsedTextLength": "1323", "sov:ParseTime": "125", "sov:ResumeQuality": { "sov:Assessments": { "sov:Assessment": [{ "sov:Level": "Data Missing", "sov:Findings": { "sov:Information": ["[Sovren:231;DEG-1,DEG-2] The following educational degrees do not have a degree name: DEG-1, DEG-2. Every degree in a resume should have a name or type associated with it, such as 'B.S.' or 'M.S.'."] } }] } }, "sov:LicenseSerialNumber": "38906528:0fc4c5e0-c91b-4e12-bfed-f42e79108d4a", "sov:ParserConfigurationString": "Coverage.PersonalAttributes = True; Coverage.Training = True; Culture.CountryCodeForUnitedKingdomIsUK = True; Culture.DefaultCountryCode = US; Culture.Language = English; Culture.PreferEnglishVersionIfTwoLanguagesInDocument = False; Data.UserDefinedParsing = False; OutputFormat.AssumeCompanyNameFromPrecedingJob = False; OutputFormat.ContactMethod.PackStyle = Split; OutputFormat.DateOutputStyle = ExplicitlyKnownDateInfoOnly; OutputFormat.NestJobsBasedOnDateRanges = True; OutputFormat.NormalizeRegions = False; OutputFormat.SkillsStyle = Default; OutputFormat.StripParsedDataFromPositionHistoryDescription = True; OutputFormat.TelcomNumber.Style = Raw; OutputFormat.XmlFormat = HrXmlResume25", "sov:ParserVersion": "9.4.1.0", "sov:DigitalSignature": "AiD///////8=", "sov:TrainingHistory": { "sov:Text": "09/2000 - 06/2007\tmy achievements,\r\nskills, references, and more.", "sov:Training": [{ "sov:Type": "Unknown", "sov:TrainingName": "unknown type and data", "sov:Entity": "unknown type and data", "sov:Description": "09/2000 - 06/2007\tmy achievements", "sov:StartDate": { "YearMonth": "2000-09" }, "sov:EndDate": { "YearMonth": "2007-06" } }] }, "sov:Hobbies": { "sov:Text": "• The production of, and the processes which lead to high quality software.\r\n• Fostering a culture which emphasises quality throughout the entire software process.\r\n• I enjoy leadership, building proficient and motivated teams and helping others learn." } } } } }

const a = mapObject(
    aa,
    [
        {
            "source": "Resume.StructuredXMLResume.ContactInfo.PersonName.FormattedName",
            "target": {
                "path": "name.full",
                priority: 3
            }
        },
        {
            "source": "Resume.StructuredXMLResume.ContactInfo.PersonName.GivenName",
            "target": {
                "path": "name.full",
                priority: 2
            },
        },
        {
            "source": "Resume.StructuredXMLResume.ContactInfo.PersonName.FamilyName",
            "target": {
                "path": "name.middle"
            },
        },
        {
            "source": "Resume.StructuredXMLResume.ContactInfo.PersonName.SomethingMadeUp",
            "target": {
                "path": "name.full",
                priority: 0
            }
        },
        {
            "source": "Resume.StructuredXMLResume.ContactInfo.ContactMethod[].InternetEmailAddress",
            "target": {
                "path": "email[].address",
            },
        },
        {
            "source": "Resume.StructuredXMLResume.EmploymentHistory.EmployerOrg[].EmployerOrgName",
            "target": {
                "path": "employment[].company",
            },
        },
        
        // {
        //     "source": "Resume.StructuredXMLResume.EmploymentHistory.EmployerOrg[].PositionHistory[].Title",
        //     "target": {
        //         "path": "employment[].jobTitle",
        //     },
        // },
        // {
        //     "source": "Resume.StructuredXMLResume.EmploymentHistory.EmployerOrg[].PositionHistory[].StartDate.YearMonth",
        //     "target": {
        //         "path": "employment[].startDate",
        //     },
        // },
        // {
        //     "source": "Resume.StructuredXMLResume.EmploymentHistory.EmployerOrg[].PositionHistory[].EndDate.YearMonth",
        //     "target": {
        //         "path": "employment[].endDate",
        //     },
        // },
        // {
        //     "source": "Resume.StructuredXMLResume.EducationHistory.SchoolOrInstitution[].Degree[].DegreeMajor[].Name[]",
        //     "target": {
        //         "path": "education[].degree",
        //     },
        // },
        // {
        //     "source": "Resume.StructuredXMLResume.EducationHistory.SchoolOrInstitution[].Degree[].DatesOfAttendance[].StartDate.YearMonth",
        //     "target": {
        //         "path": "education[].startDate",
        //     },
        // },
        // {
        //     "source": "Resume.StructuredXMLResume.EducationHistory.SchoolOrInstitution[].Degree[].DatesOfAttendance[].EndDate.YearMonth",
        //     "target": {
        //         "path": "education[].endDate",
        //     },
        // },
        // {
        //     "source": "Resume.StructuredXMLResume.EducationHistory.SchoolOrInstitution[].School[].SchoolName",
        //     "target": {
        //         "path": "education[].institution",
        //     },
        // }
    ]
)

console.log(JSON.stringify(a, null, 2));
