import "./App.css";
import { useState } from "react";
import MapComponent from "./MapComponent";

function App() {
  const [activeTab, setActiveTab] = useState("firefighters");

  const firefighters = [
    {
      id: 1,
      name: "Jan Kowalski",
      rank: "Starszy Strażak",
      position: "Dowódca Zastępu",
      connected: true,
      bpm: 72,
      pressure: 100,
      battery: 85,
      movement: "Bieg",
      scba: 80,
      time: 35,
      stress: "Niski",
    },
    {
      id: 2,
      name: "Piotr Nowak",
      rank: "Strażak",
      position: "Ratownik",
      connected: false,
      bpm: 68,
      pressure: 90,
      battery: 60,
      movement: "Chód",
      scba: 60,
      time: 50,
      stress: "Średni",
    },
  ];

  const beacons = [
    { id: 1, name: "Beacon 1", location: "Strefa A", active: true, tags: 4, battery: 90 },
    { id: 2, name: "Beacon 2", location: "Strefa B", active: false, tags: 0, battery: 0 },
  ];

  const nibs = [
    { id: 1, name: "NIB-001", online: true, uptime: 120, internet: true, lora: true, wifi: false, gps: true },
    { id: 2, name: "NIB-002", online: false, uptime: 0, internet: false, lora: false, wifi: false, gps: false },
  ];

  const alerts = [
    { id: 1, message: "Pożar w strefie C", systemOk: true },
  ];

  return (
    <div className="App">
      <div className="TopMenu"></div>

      <main className="MainContainer">
        <div className="LeftPanel">
          <MapComponent />
        </div>

        <div className="RightPanel">
          {/* Menu poziome */}
          <div className="HorizontalMenu">
            <button
              className={activeTab === "firefighters" ? "active" : ""}
              onClick={() => setActiveTab("firefighters")}
            >
              Strażacy
            </button>
            <button
              className={activeTab === "beacons" ? "active" : ""}
              onClick={() => setActiveTab("beacons")}
            >
              Beacony
            </button>
            <button
              className={activeTab === "nib" ? "active" : ""}
              onClick={() => setActiveTab("nib")}
            >
              NIB
            </button>
            <button
              className={activeTab === "alerts" ? "active" : ""}
              onClick={() => setActiveTab("alerts")}
            >
              Alerty
            </button>
          </div>

          <div className="RightContent">
            {/* Strażacy */}
            {activeTab === "firefighters" && (
              <div className="FirefighterGrid">
                {firefighters.map((ff) => (
                  <div key={ff.id} className="FirefighterCard">
                    <div className="FirefighterHeader">
                      <div className="FirefighterName">{ff.name}</div>
                      <div className="FirefighterBattery">{ff.battery}%</div>
                    </div>
                    <div className="FirefighterSubInfo">
                      <div>{ff.rank}</div>
                      <div>{ff.position}</div>
                    </div>
                    <div className="FirefighterParamRow">
                      <span>Połączony: <span style={{ color: ff.connected ? "green" : "red" }}>{ff.connected ? "Tak" : "Nie"}</span></span>
                      <span>BPM: {ff.bpm}</span>
                    </div>
                    <div className="FirefighterParamRow">
                      <span>Ciśnienie: {ff.pressure}</span>
                      <span>Ruch: {ff.movement}</span>
                    </div>
                    <div>
                      <div className="SCBAContainer">
                        <span>SCBA:</span>
                        <span className="SCBAValue">{ff.scba} barów</span>
                      </div>

                    </div>
                    <div className="FirefighterParamRow">
                      <span>Czas: {ff.time} min</span>
                      <span>Stres: {ff.stress}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Beacony */}
            {activeTab === "beacons" && (
              <div className="CardGrid">
                {beacons.map((b) => (
                  <div key={b.id} className="Card">
                    <h3>{b.name}</h3>
                    <div className="CardRow">
                      <span>Lokalizacja: {b.location}</span>
                      <span>Aktywny: <span style={{ color: b.active ? "green" : "red" }}>{b.active ? "Tak" : "Nie"}</span></span>
                    </div>
                    <div className="CardRow">
                      <span>Ilość tagów: {b.tags}</span>
                      <span>Bateria: {b.battery}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NIB */}
            {activeTab === "nib" && (
              <div className="CardGrid">
                {nibs.map((n) => (
                  <div key={n.id} className="Card">
                    <h3>{n.name}</h3>
                    <div className="CardRow">
                      <span>Online: <span style={{ color: n.online ? "green" : "red" }}>{n.online ? "Tak" : "Nie"}</span></span>
                      <span>Czas działania: {n.uptime} min</span>
                    </div>
                    <div className="CardRow">
                      <span>Internet: {n.internet ? "Tak" : "Nie"}</span>
                      <span>LoRa: {n.lora ? "Tak" : "Nie"}</span>
                    </div>
                    <div className="CardRow">
                      <span>WiFi: {n.wifi ? "Tak" : "Nie"}</span>
                      <span>GPS: {n.gps ? "Tak" : "Nie"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Alerty */}
            {activeTab === "alerts" && (
              <div className="CardGrid">
                {alerts.length > 0 ? (
                  alerts.map((a) => (
                    <div key={a.id} className="Card">
                      <p>{a.message}</p>
                      <p>System działa prawidłowo: <span style={{ color: a.systemOk ? "green" : "red" }}>{a.systemOk ? "Tak" : "Nie"}</span></p>
                    </div>
                  ))
                ) : (
                  <div className="Card">
                    <p>Brak aktywnych alarmów</p>
                    <p>System działa prawidłowo: Tak</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
