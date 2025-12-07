import WebSocket from "ws";
import fs from "fs";
import mysql from "mysql2/promise";
import dayjs from "dayjs";

// URL WebSocket
const URL = "wss://niesmiertelnik.replit.app/ws";

const ws = new WebSocket(URL);

ws.on("open", () => {
    console.log("Połączono z WebSocketem!");
});

// konfiguracja połączenia
const db = await mysql.createConnection({
    host: "localhost",
    user: "root",        // zmień jeśli masz inne konto
    password: "",        // wpisz swoje hasło
    database: "psp", // wpisz nazwę swojej bazy
	charset: "latin1_swedish_ci"
});

ws.on("message", async (data) => {
    try {
        // Jeśli dane są tekstem JSON — spróbuj sparsować
        let parsed;
        try {
            parsed = JSON.parse(data);
        } catch {
            parsed = { raw: data.toString() };
        }
		switch(parsed.type) {
		  case "firefighters_list":
			await db.execute("TRUNCATE TABLE `strazak`");
			parsed.firefighters.forEach(strazak => wpisz_strazaka(strazak));
			break;
		  case "tag_telemetry":
			update_pozycji(parsed);
			break;
		  case "building_config":
			nowa_akcja(parsed);
			break;
			
		  default:
		}
    } catch (err) {
        console.error("Błąd zapisu:", err);
    }
});

ws.on("close", () => {
    console.log("Połączenie zamknięte");
});

ws.on("error", (err) => {
    console.error("Błąd Socketa:", err);
});

async function wpisz_strazaka(strazak){
	var [rows, fields] = await db.execute("SELECT `ID` FROM `zespoly` WHERE `ZespolName` LIKE (?);", [strazak.team ?? null] );
	var zespol_id = rows[0].ID;
	let dlugie_zapytanie = "INSERT INTO `strazak` VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
	await db.execute(dlugie_zapytanie, [strazak.id ?? null,  strazak.name ?? null,  zespol_id ?? null,  2 ?? null,  0 ?? null,  0 ?? null,  0 ?? null,  strazak.tag_id ?? null,  strazak.role ?? null,  strazak.rank ?? null,  strazak.hr_band_id ?? null,  strazak.scba_id ?? null,  strazak.recco_id ?? null]);
}

async function update_pozycji(firefighter_info){
	let krotkie_zapytanie = "INSERT INTO `pozycja` (`StrazakID`, `X`, `Y`, `Z`, `Czas`) VALUES (?, ?, ?, ?, ?);";
	await db.execute(krotkie_zapytanie, [firefighter_info.firefighter.id ?? null,  firefighter_info.position.x ?? null,  firefighter_info.position.y ?? null,  firefighter_info.position.z ?? null,  dayjs(firefighter_info.timestamp).format("YYYY-MM-DD HH:mm:ss") ?? null]);
	let krotki_update = "UPDATE `strazak` SET `Status` = (?), `Bateria` = (?), `BPM` = (?) WHERE `ID` = (?);";
	var [rows, fields] = await db.execute("SELECT `ID` FROM `status` WHERE `Status`.`Status` LIKE (?);", [firefighter_info.pass_status.status ?? null]);
	if(rows == []){
		await db.execute("INSERT INTO `status` VALUES (?, ?);", [null, firefighter_info.pass_status.status]);
		var [rows, fields] = await db.execute("SELECT `ID` FROM `status` WHERE `Status`.`Status` LIKE (?);", [firefighter_info.pass_status.status ?? null]);
	}
	var status_id = rows[0].ID;
	await db.execute(krotki_update, [status_id ?? null,  firefighter_info.vitals.hr_band_battery ?? null,  firefighter_info.vitals.heart_rate_bpm ?? null,  firefighter_info.id ?? null]);
}

async function nowa_akcja(building_info){
	// sprawdza czy typ budynku istnieje
	var [rows, fields] = await db.execute("SELECT COUNT(*) AS `obecna` FROM `typybudynkow` WHERE `Nazwa` Like (?);", [building_info.building.type ]);
	if(!(rows[0].obecna)){
		// dodaje typ budynku do bazy jesli nie istnial
		await db.execute("INSERT INTO `typybudynkow` (`Nazwa`) VALUES (?);", [building_info.building.type ?? null]);
	}
	var [rows, fields] = await db.execute("SELECT `ID` FROM `typybudynkow` WHERE `Nazwa` Like (?);", [building_info.building.type ?? null]);	
	var typbudynku_id = rows[0].ID;
	// sprawdza czy budynek istnieje juz w bazie
	var [rows, fields] = await db.execute("SELECT COUNT(*) AS `obecna` FROM `budynek` WHERE `Adres` Like (?);", [building_info.building.address ?? null]);
	if(!(rows[0].obecna)){
		// dodaje budynek bo nie istnial
		let dlugie_zapytanie = "INSERT INTO `budynek`  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
		await db.execute(dlugie_zapytanie, [building_info.building.id ?? null, building_info.building.name ?? null, building_info.building.address ?? null, typbudynku_id ?? null, building_info.building.dimensions.width_m ?? null, building_info.building.dimensions.depth_m ?? null, building_info.building.dimensions.height_m ?? null,  building_info.building.gps_reference.origin.lat ?? null,  building_info.building.gps_reference.origin.lon ?? null, building_info.building.gps_reference.origin.altitude_m ?? null, building_info.building.gps_reference.rotation_deg ?? null, building_info.building.gps_reference.scale_lat_m_per_deg ?? null, building_info.building.gps_reference.scale_lon_m_per_deg ?? null]);
		// dodaje klatki schodowe bo budynek nie istnial
		building_info.building.stairwells.forEach(async(schody) => {
			await db.execute("INSERT INTO `klatkaschodowa` VALUES (?, ?);", [schody.id ?? null, building_info.building.id ?? null]);
		});
		// dodaje pietra bo budynek nie istnial
		building_info.building.floors.forEach(async(pietra) => {
			await db.execute("INSERT INTO `pietra` VALUES (?, ?, ?, ?, ?, ?);", [null, building_info.building.id ?? null, pietra.number ?? null, pietra.name ?? null, pietra.height_m ?? null, pietra.hazard_level ?? null]);
		});
		// tworzy relacje pietro-klatka schodowa
		building_info.building.stairwells.forEach(async(schody) => {
			// na kazde pietro wylistowane w jsonie klatki
			schody.floors.forEach(async(pietro_klatki_schodowej) => {
				//wyszukuje pietro tego budynku i laczy je relacja wiele-wiele
				var [rows, fields] = await db.execute("SELECT `ID`, `Numer` FROM `pietra` WHERE `BudynekID` Like (?);", [building_info.building.id ?? null]);
				rows.forEach(async(actual_pietro) => {
					// dodaje relacje
					if(pietro_klatki_schodowej == actual_pietro.Numer){
						await db.execute("INSERT INTO `klatka-pietra` (`KlatkaSchodowaID`, `PietroID`) VALUES (?, ?);", [schody.id ?? null, actual_pietro.ID ?? null]);
					}
				});
			});
		});
		building_info.building.hazard_zones.forEach(async(zagrozenie) => {
			var [rows, fields] = await db.execute("SELECT COUNT(*) AS `obecna` FROM `zagrozenia` WHERE `Nazwa` Like (?);", [zagrozenie.type ?? null]);
			if(!(rows[0].obecna)){
				// dodaje typ budynku do bazy jesli nie istnial
				await db.execute("INSERT INTO `zagrozenia` (`Nazwa`) VALUES (?);", [zagrozenie.type ?? null]);
			}
			var [rows, fields] = await db.execute("SELECT `ID` FROM `zagrozenia` WHERE `Nazwa` Like (?);", [zagrozenie.type ?? null]);	
			var zagrozenie_id = rows[0].ID;
			var [rows, fields] = await db.execute("SELECT `ID` FROM `pietra` WHERE `BudynekID` Like (?) AND `Numer` = (?);", [building_info.building.id ?? null, zagrozenie.floor ?? null]);
			await db.execute("INSERT INTO `hazard_zones` VALUES (?, ?, ?, ?, ?, ?, ?, ?);", [zagrozenie.id ?? null, zagrozenie.name ?? null, rows[0].ID ?? null, zagrozenie.bounds.x1 ?? null, zagrozenie.bounds.y1 ?? null, zagrozenie.bounds.x2 ?? null, zagrozenie.bounds.y2 ?? null, zagrozenie_id ?? null]);
		});
		building_info.building.entry_points.forEach(async(wyjscie) => {
			var [rows, fields] = await db.execute("SELECT `ID` FROM `pietra` WHERE `BudynekID` Like (?) AND `Numer` = (?);", [building_info.building.id ?? null, wyjscie.floor ?? null]);
			
			await db.execute("INSERT INTO `punkty_wejscia` VALUES (?, ?, ?, ?, ?);", [wyjscie.id ?? null, wyjscie.name ?? null, wyjscie.position.x ?? null, wyjscie.position.y ?? null, rows[0].ID ?? null]);
		});
	}
	// dodaje nowa akcje w budynku
	await db.execute("INSERT INTO `akcje` (`CzasWejscia`, `BudynekID`) VALUES (?, ?);", [dayjs(building_info.timestamp).format("YYYY-MM-DD HH:mm:ss") ?? null, building_info.building.id ?? null]);
}