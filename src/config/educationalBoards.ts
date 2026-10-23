export const EDUCATIONAL_BOARDS = [
    {
        "name": "Central Board of Secondary Education",
        "acronym": "CBSE",
        "jurisdiction": "National / International"
    },
    {
        "name": "Council for the Indian School Certificate Examinations",
        "acronym": "CISCE / ICSE",
        "jurisdiction": "National"
    },
    {
        "name": "National Institute of Open Schooling",
        "acronym": "NIOS",
        "jurisdiction": "National (Open Schooling)"
    },
    {
        "name": "International Baccalaureate",
        "acronym": "IB",
        "jurisdiction": "International"
    },
    {
        "name": "Cambridge Assessment International Education",
        "acronym": "CAIE / IGCSE",
        "jurisdiction": "International"
    },
    {
        "name": "Andhra Pradesh Board of Secondary Education",
        "acronym": "BSEAP",
        "jurisdiction": "Andhra Pradesh"
    },
    {
        "name": "Arunachal Pradesh Board of Secondary Education and Higher Secondary Education",
        "acronym": "DSEAP",
        "jurisdiction": "Arunachal Pradesh"
    },
    {
        "name": "Board of Secondary Education, Assam",
        "acronym": "SEBA",
        "jurisdiction": "Assam"
    },
    {
        "name": "Chandigarh Board",
        "acronym": "Chandigarh Board",
        "jurisdiction": "Chandigarh"
    },
    {
        "name": "Chhattisgarh Board of Secondary Education",
        "acronym": "CGBSE",
        "jurisdiction": "Chhattisgarh"
    },
    {
        "name": "Goa Board Of Secondary and Higher Secondary Education",
        "acronym": "GBSHSE",
        "jurisdiction": "Goa"
    },
    {
        "name": "Gujarat Secondary and Higher Secondary Education Board",
        "acronym": "GSEB",
        "jurisdiction": "Gujarat"
    },
    {
        "name": "Haryana Board of School Education",
        "acronym": "HBSE",
        "jurisdiction": "Haryana"
    },
    {
        "name": "Himachal Pradesh Board of Secondary Education",
        "acronym": "HPBOSE",
        "jurisdiction": "Himachal Pradesh"
    },
    {
        "name": "Jammu and Kashmir Board of School Education",
        "acronym": "JKBOSE",
        "jurisdiction": "Jammu & Kashmir"
    },
    {
        "name": "Jharkhand Academic Council",
        "acronym": "JAC",
        "jurisdiction": "Jharkhand"
    },
    {
        "name": "Kerala Board of Public Examinations",
        "acronym": "KBPE",
        "jurisdiction": "Kerala"
    },
    {
        "name": "Ladakh Board of School Education",
        "acronym": "Ladakh Board",
        "jurisdiction": "Ladakh"
    },
    {
        "name": "Board of Secondary Education, Madhya Pradesh",
        "acronym": "MPBSE",
        "jurisdiction": "Madhya Pradesh"
    },
    {
        "name": "Board of Secondary Education, Manipur",
        "acronym": "BSEM",
        "jurisdiction": "Manipur"
    },
    {
        "name": "Meghalaya Board of School Education",
        "acronym": "MBOSE",
        "jurisdiction": "Meghalaya"
    },
    {
        "name": "Mizoram Board of Secondary Education",
        "acronym": "MBSE",
        "jurisdiction": "Mizoram"
    },
    {
        "name": "Nagaland Board of Secondary Education",
        "acronym": "NBSE",
        "jurisdiction": "Nagaland"
    },
    {
        "name": "Board of Secondary Education, Odisha",
        "acronym": "BSE",
        "jurisdiction": "Odisha"
    },
    {
        "name": "Puducherry Board",
        "acronym": "Puducherry Board",
        "jurisdiction": "Puducherry"
    },
    {
        "name": "Punjab School Education Board",
        "acronym": "PSEB",
        "jurisdiction": "Punjab"
    },
    {
        "name": "Board of Higher Secondary Education, Sikkim State",
        "acronym": "SBSE",
        "jurisdiction": "Sikkim"
    },
    {
        "name": "Board of Secondary Education, Telangana",
        "acronym": "BSET",
        "jurisdiction": "Telangana"
    },
    {
        "name": "Tripura Board of Secondary Education",
        "acronym": "TBSE",
        "jurisdiction": "Tripura"
    },
    {
        "name": "Uttarakhand Board of Secondary Education",
        "acronym": "UBSE",
        "jurisdiction": "Uttarakhand"
    },
    {
        "name": "West Bengal Board of Secondary Education",
        "acronym": "WBBSE",
        "jurisdiction": "West Bengal"
    }
];

export const BOARD_OPTIONS = [
    ...EDUCATIONAL_BOARDS.map((board) => {
        const text = `(${board.acronym}) ${board.name}`;
        return {
            value: text,
            label: text,
        };
    }),
    { value: "Others", label: "Others" },
];