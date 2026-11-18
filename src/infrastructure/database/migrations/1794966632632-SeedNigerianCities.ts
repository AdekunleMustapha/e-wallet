import { MigrationInterface, QueryRunner } from "typeorm";

const COUNTRY = "Nigeria";

const CITIES_BY_STATE: Record<string, string[]> = {
    "Abia": ["Umuahia", "Aba", "Arochukwu", "Bende", "Ohafia", "Isuikwuato", "Umunneochi", "Ikwuano", "Item", "Okpuala Ngwa"],
    "Adamawa": ["Yola", "Mubi", "Jimeta", "Numan", "Ganye", "Gombi", "Mayo Belwa", "Michika", "Hong", "Song", "Girei"],
    "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak", "Itu", "Ikot Abasi", "Etinan", "Ibeno", "Mkpat Enin", "Essien Udim"],
    "Anambra": ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Aguata", "Ihiala", "Otuocha", "Nkpor", "Obosi", "Agulu", "Oko", "Igbo-Ukwu"],
    "Bauchi": ["Bauchi", "Azare", "Misau", "Katagum", "Jama'are", "Ningi", "Darazo", "Alkaleri", "Tafawa Balewa", "Dass", "Gamawa", "Zaki"],
    "Bayelsa": ["Yenagoa", "Brass", "Nembe", "Ogbia", "Sagbama", "Ekeremor", "Kaiama", "Twon-Brass", "Amassoma", "Okolobiri"],
    "Benue": ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Vandeikya", "Adikpo", "Ugbokpo", "Oju", "Aliade", "Zaki Biam", "Wannune", "Igumale"],
    "Borno": ["Maiduguri", "Bama", "Biu", "Dikwa", "Gwoza", "Konduga", "Monguno", "Damboa", "Kukawa", "Ngala", "Askira", "Gamboru"],
    "Cross River": ["Calabar", "Ikom", "Ogoja", "Obudu", "Ugep", "Akamkpa", "Oban", "Ikang", "Obubra", "Akpabuyo", "Boki"],
    "Delta": ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor", "Abraka", "Effurun", "Oghara", "Kwale", "Burutu", "Koko", "Ozoro", "Orerokpe", "Obiaruku"],
    "Ebonyi": ["Abakaliki", "Afikpo", "Onueke", "Ezzamgbo", "Ishiagu", "Effium", "Nkalagu", "Ohaozara", "Edda", "Ikwo"],
    "Edo": ["Benin City", "Auchi", "Ekpoma", "Uromi", "Igarra", "Sabongida-Ora", "Irrua", "Agbor Nta", "Okada", "Ubiaja", "Igueben", "Fugar"],
    "Ekiti": ["Ado-Ekiti", "Ikere-Ekiti", "Oye-Ekiti", "Ijero-Ekiti", "Ikole-Ekiti", "Efon-Alaaye", "Omuo-Ekiti", "Aramoko-Ekiti", "Ise-Ekiti", "Emure-Ekiti", "Ido-Ekiti", "Ilawe-Ekiti"],
    "Enugu": ["Enugu", "Nsukka", "Oji River", "Agbani", "Awgu", "Udi", "Ngwo", "Obollo-Afor", "Ninth Mile", "Emene", "Eha-Amufu", "Ogbede"],
    "Federal Capital Territory": ["Abuja", "Gwagwalada", "Kuje", "Bwari", "Kwali", "Abaji", "Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa", "Lugbe", "Nyanya", "Karu"],
    "Gombe": ["Gombe", "Kaltungo", "Billiri", "Dukku", "Bajoga", "Kumo", "Akko", "Deba", "Nafada", "Hinna", "Yamaltu"],
    "Imo": ["Owerri", "Orlu", "Okigwe", "Mbaise", "Oguta", "Mgbidi", "Ohaji", "Nkwerre", "Atta", "Ideato", "Oru", "Orsu"],
    "Jigawa": ["Dutse", "Hadejia", "Gumel", "Kazaure", "Ringim", "Birnin Kudu", "Kafin Hausa", "Babura", "Gwaram", "Birniwa", "Maigatari", "Garki"],
    "Kaduna": ["Kaduna", "Zaria", "Kafanchan", "Sabon Gari", "Kagoro", "Birnin Gwari", "Saminaka", "Zonkwa", "Makarfi", "Ikara", "Soba", "Kachia", "Kajuru"],
    "Kano": ["Kano", "Wudil", "Gwarzo", "Rano", "Bichi", "Dawakin Tofa", "Gaya", "Karaye", "Kura", "Sumaila", "Tudun Wada", "Danbatta", "Rimin Gado", "Fagge"],
    "Katsina": ["Katsina", "Daura", "Funtua", "Malumfashi", "Kankia", "Dutsin-Ma", "Mani", "Mashi", "Kaita", "Jibia", "Bakori", "Danja", "Batsari", "Kankara"],
    "Kebbi": ["Birnin Kebbi", "Argungu", "Zuru", "Yauri", "Jega", "Koko", "Bagudo", "Bunza", "Gwandu", "Kalgo", "Aliero", "Ribah"],
    "Kogi": ["Lokoja", "Okene", "Kabba", "Idah", "Anyigba", "Ankpa", "Ajaokuta", "Dekina", "Egbe", "Isanlu", "Ogaminana", "Koton Karfe", "Ogori"],
    "Kwara": ["Ilorin", "Offa", "Omu-Aran", "Jebba", "Lafiagi", "Patigi", "Share", "Kaiama", "Bode Saadu", "Ajasse Ipo", "Erin-Ile", "Pategi", "Malete"],
    "Lagos": ["Ikeja", "Lagos Island", "Victoria Island", "Ikoyi", "Lekki", "Ajah", "Surulere", "Yaba", "Apapa", "Badagry", "Epe", "Ikorodu", "Mushin", "Oshodi", "Alimosho", "Agege", "Ojo", "Festac Town", "Maryland", "Gbagada", "Magodo", "Ketu", "Isolo", "Egbeda", "Ipaja", "Ayobo", "Sangotedo", "Ibeju-Lekki", "Ilupeju", "Ojota"],
    "Nasarawa": ["Lafia", "Keffi", "Akwanga", "Nasarawa", "Karu", "Doma", "Wamba", "Toto", "Obi", "Mararaba", "Kokona", "Karshi"],
    "Niger": ["Minna", "Bida", "Suleja", "Kontagora", "Lapai", "New Bussa", "Mokwa", "Agaie", "Mariga", "Paiko", "Tegina", "Zungeru", "Badeggi", "Kagara"],
    "Ogun": ["Abeokuta", "Ijebu-Ode", "Sagamu", "Ota", "Ilaro", "Ifo", "Ago-Iwoye", "Ijebu-Igbo", "Iperu", "Ayetoro", "Mowe", "Ibafo", "Sango Ota", "Imeko", "Ijebu-Ife", "Owode"],
    "Ondo": ["Akure", "Ondo", "Owo", "Ikare-Akoko", "Okitipupa", "Ore", "Ile-Oluji", "Idanre", "Igbara-Oke", "Ifon", "Oka-Akoko", "Igbokoda", "Akungba-Akoko"],
    "Osun": ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Iwo", "Ikirun", "Ila-Orangun", "Ejigbo", "Ikire", "Ilobu", "Gbongan", "Inisa", "Ora-Igbomina", "Ipetu-Ijesa"],
    "Oyo": ["Ibadan", "Ogbomoso", "Oyo", "Iseyin", "Saki", "Igboho", "Eruwa", "Igbo-Ora", "Kisi", "Lanlate", "Fiditi", "Okeho", "Ido", "Ibarapa", "Tede", "Awe"],
    "Plateau": ["Jos", "Bukuru", "Pankshin", "Shendam", "Barkin Ladi", "Vom", "Langtang", "Wase", "Mangu", "Kwa", "Bokkos", "Kanke", "Quan Pan"],
    "Rivers": ["Port Harcourt", "Bonny", "Ahoada", "Omoku", "Okrika", "Degema", "Bori", "Eleme", "Oyigbo", "Rumuokoro", "Choba", "Rumuigbo", "Trans-Amadi", "Buguma", "Opobo", "Kpor"],
    "Sokoto": ["Sokoto", "Tambuwal", "Gwadabawa", "Wurno", "Illela", "Binji", "Bodinga", "Goronyo", "Rabah", "Shagari", "Gudu", "Isa", "Sabon Birni"],
    "Taraba": ["Jalingo", "Wukari", "Bali", "Takum", "Gembu", "Mutum Biyu", "Zing", "Lau", "Serti", "Donga", "Ibi", "Gassol", "Karim Lamido"],
    "Yobe": ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam", "Buni Yadi", "Gujba", "Fika", "Machina", "Dapchi", "Yunusari", "Jakusko"],
    "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka", "Tsafe", "Bungudu", "Maru", "Zurmi", "Bakura", "Gummi", "Shinkafi", "Maradun", "Bukkuyum"],
};

const esc = (value: string): string => value.replace(/'/g, "''");

export class SeedNigerianCities1794966632632 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const rows: string[] = [];
        for (const [state, cities] of Object.entries(CITIES_BY_STATE)) {
            for (const city of new Set(cities)) {
                rows.push(`('${esc(city)}', '${esc(state)}', '${COUNTRY}')`);
            }
        }

        await queryRunner.query(`
            INSERT INTO cities (city, state, country)
            VALUES ${rows.join(",\n                   ")}
            ON CONFLICT (state, city) DO NOTHING
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const states = Object.keys(CITIES_BY_STATE).map((s) => `'${esc(s)}'`).join(", ");
        await queryRunner.query(
            `DELETE FROM cities WHERE country = '${COUNTRY}' AND state IN (${states})`
        );
    }

}
