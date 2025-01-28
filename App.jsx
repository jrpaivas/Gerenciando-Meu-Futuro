
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("Resumo Geral");
  const [darkMode, setDarkMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [specialtyHours, setSpecialtyHours] = useState({
    Pediatria: 75,
    Preventiva: 69,
    Cirurgia: 69,
    Ginecologia: 63,
    Obstetrícia: 51,
    Infectologia: 39,
    Gastro: 33,
    Endocrino: 33,
    Nefro: 30,
    Cardiologia: 39,
    Neuro: 27,
    Pneumo: 21,
    Hemato: 27,
    Psiquiatria: 27,
    Hepato: 21,
    Reumato: 24,
    Dermato: 18,
    Ortopedia: 27,
    Otorrino: 18,
    Oftalmo: 15,
  });
  const [reminders, setReminders] = useState([
    { date: new Date().toISOString().split("T")[0], message: "Estudar Pediatria por 2 horas" },
    { date: new Date().toISOString().split("T")[0], message: "Revisar questões de Cirurgia" },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newReminder, setNewReminder] = useState({ date: "", message: "" });

  const specialties = Object.keys(specialtyHours);

  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleTimerStop = (specialty) => {
    const hoursStudied = timer / 3600;
    setSpecialtyHours((prev) => ({
      ...prev,
      [specialty]: (prev[specialty] || 0) + hoursStudied,
    }));
    setTimer(0);
    setIsTimerRunning(false);
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    setReminders([...reminders, newReminder]);
    setNewReminder({ date: "", message: "" });
  };

  const remindersForDate = reminders.filter(
    (reminder) => reminder.date === selectedDate.toISOString().split("T")[0]
  );

  const totalHours = Object.values(specialtyHours).reduce((sum, hours) => sum + hours, 0);

  const barData = {
    labels: specialties,
    datasets: [
      {
        label: "Horas Estudadas",
        data: specialties.map((spec) => specialtyHours[spec]),
        backgroundColor: darkMode ? "#4F46E5" : "#1E3A8A",
      },
    ],
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"}>
      <header className="p-4 bg-blue-800 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciando Meu Futuro</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          {darkMode ? "Modo Claro" : "Modo Escuro"}
        </button>
      </header>

      <div className="flex">
        <aside className="w-1/4 bg-blue-800 text-white p-4 space-y-2">
          <h2 className="text-xl font-bold mb-4">Navegação</h2>
          <button
            onClick={() => setSelectedSpecialty("Resumo Geral")}
            className={`block w-full text-left px-4 py-2 rounded ${
              selectedSpecialty === "Resumo Geral" ? "bg-blue-700" : ""
            }`}
          >
            Resumo Geral
          </button>
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`block w-full text-left px-4 py-2 rounded ${
                selectedSpecialty === specialty ? "bg-blue-700" : ""
              }`}
            >
              {specialty}
            </button>
          ))}
        </aside>

        <main className="w-3/4 p-6 space-y-6">
          {selectedSpecialty === "Resumo Geral" ? (
            <>
              <h2 className="text-xl font-bold">Resumo Geral</h2>
              <p>Total de Horas Estudadas: {totalHours.toFixed(2)}h</p>

              <div className="mt-4">
                <Bar data={barData} />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">{selectedSpecialty}</h2>
              <p>Horas Estudadas: {specialtyHours[selectedSpecialty]?.toFixed(2)}h</p>
            </>
          )}

          <section className="mt-6">
            <h2 className="text-lg font-bold">Cronômetro de Estudos</h2>
            <p>Tempo Atual: {Math.floor(timer / 3600)}h {Math.floor((timer % 3600) / 60)}m {timer % 60}s</p>
            <button
              onClick={handleTimerToggle}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isTimerRunning ? "Pausar" : "Iniciar"}
            </button>
            <button
              onClick={() => handleTimerStop(selectedSpecialty)}
              className="mt-2 ml-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Parar e Salvar Tempo
            </button>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-bold">Agenda</h2>
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              className="mt-4"
            />
            <div className="mt-4">
              <h3 className="text-md font-semibold">Lembretes para {selectedDate.toDateString()}</h3>
              <ul>
                {remindersForDate.length > 0 ? (
                  remindersForDate.map((reminder, index) => (
                    <li key={index}>{reminder.message}</li>
                  ))
                ) : (
                  <li>Sem lembretes para esta data.</li>
                )}
              </ul>

              <form className="mt-4" onSubmit={handleAddReminder}>
                <label className="block">Data:</label>
                <input
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
                <label className="block mt-2">Lembrete:</label>
                <input
                  type="text"
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Adicionar Lembrete
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
            