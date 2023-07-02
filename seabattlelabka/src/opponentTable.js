import React, { useState, useEffect } from "react";
import { generateRandomShips } from "./shipUtils.js";

const OpponentTable = () => {
  const [cells, setCells] = useState(
    Array.from({ length: 10 }, () => new Array(10))
  );

  const [opponentCells, setOpponentCells] = useState(
    Array.from({ length: 10 }, () => new Array(10))
  );

  const [freeToAttackCells, setFreeToAttackCells] = useState([]);

  const [isEnemyOrder, setEnemyOrder] = useState(false);

  const [playerFieldStatistic, setPlayerFieldStatistic] = useState({
    cellsLeft: 100,
    shipsLeft: 20,
    shipsDestroyed: 0,
  });

  const [opponentFieldStatistic, setOpponentFieldStatistic] = useState({
    cellsLeft: 100,
    shipsDestroyed: 0,
  });

  const [gameEnd, setGameEnd] = useState({
    isGameFinished: false,
    isPlayerWin: false,
  });

  useEffect(() => {
    setCells(generateRandomShips());
    setOpponentCells(generateRandomShips());
    const array = [];

    for (let i = 0; i <= 9; i++) {
      for (let j = 0; j <= 9; j++) {
        array.push({ row: i, coll: j });
      }
    }

    setFreeToAttackCells(array);
  }, []);

  useEffect(() => {
    if (!isEnemyOrder) {
      return;
    }

    // Отримуємо рандомний індекс з freeToAttackCells массиву.
    // Індекс завжди буде в рамках довжини массиву
    const targetIndex = Math.floor(Math.random() * freeToAttackCells.length);

    const { row, coll } = freeToAttackCells[targetIndex];

    // Отримуємо ссилку на клітину. При модифікації цієї ссилки, реактивність зберігається.
    const cellRef = cells[row][coll];

    cellRef.clicked = true;

    if (cellRef.hasShip) {
      playerFieldStatistic.shipsDestroyed += 1;
      playerFieldStatistic.shipsLeft -= 1;
    }

    // Видаляємо цю клітину з массиву вільних для атак ботом клітин.
    freeToAttackCells.splice(targetIndex, 1);

    setFreeToAttackCells([...freeToAttackCells]);

    playerFieldStatistic.cellsLeft -= 1;

    setEnemyOrder(false);
  }, [isEnemyOrder]);

  useEffect(() => {
    if (playerFieldStatistic.shipsLeft === 0) {
      setGameEnd({ isGameFinished: true, isPlayerWin: false });
      showWinner();
    }

    if (opponentFieldStatistic.shipsDestroyed === 20) {
      setGameEnd({ isGameFinished: true, isPlayerWin: false });
      showWinner();
    }
  }, [playerFieldStatistic.shipsLeft, opponentFieldStatistic.shipsDestroyed]);

  const showWinner = () => {
    if (
      window.confirm(
        `${
          gameEnd.isPlayerWin
            ? "Вітаю, ви перемогли!"
            : "На жаль, ви програли :("
        }  Бажаєте зіграти ще раз?`
      )
    ) {
      setCells(generateRandomShips());
      setOpponentCells(generateRandomShips());
      const array = [];

      for (let i = 0; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
          array.push({ row: i, coll: j });
        }
      }

      setFreeToAttackCells(array);

      setPlayerFieldStatistic({
        cellsLeft: 100,
        shipsLeft: 20,
        shipsDestroyed: 0,
      });

      setOpponentFieldStatistic({
        cellsLeft: 100,
        shipsDestroyed: 0,
      });

      setGameEnd({
        isGameFinished: false,
        isPlayerWin: false,
      });

      return;
    }

    window.close();
  };

  const getCellColor = ({ row, col, isEnemyBoard = false }) => {
    const cell = isEnemyBoard ? opponentCells[row][col] : cells[row][col];

    if (isEnemyBoard && cell.clicked) {
      return cell.hasShip ? "red" : "black";
    }

    if (!isEnemyBoard) {
      if (cell.clicked) {
        return cell.hasShip ? "red" : "black";
      }

      if (cell.hasShip) {
        return "blue";
      }
    }

    return "white";
  };

  const handlePlayerAttack = ({ row, coll }) => {
    const cellRef = opponentCells[row][coll];

    if (cellRef.clicked) {
      return;
    }

    if (isEnemyOrder) {
      return;
    }

    cellRef.clicked = true;
    opponentFieldStatistic.cellsLeft -= 1;

    if (cellRef.hasShip) {
      opponentFieldStatistic.shipsDestroyed += 1;
    }

    setEnemyOrder(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <span>
            <h1>Гравець</h1>
            <h2>Статистика</h2>
            <p>Клітинок на полі залишилось: {playerFieldStatistic.cellsLeft}</p>
            <p>Кораблів на полі залашилось: {playerFieldStatistic.shipsLeft}</p>
            <p>Кораблів на полі збито: {playerFieldStatistic.shipsDestroyed}</p>
          </span>
        </div>
        <table style={{ paddingLeft: "10%" }}>
          {" "}
          <tbody>
            {cells.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "1px solid black",
                      textAlign: "center",
                      alignItems: "center",
                      backgroundColor: getCellColor({
                        row: rowIndex,
                        col: colIndex,
                      }),
                    }}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ігрове поле бота */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <div>
          <span>
            <h1>Опонент</h1>
            <h2>Статистика</h2>
            <p>
              Клітинок на полі залишилось: {opponentFieldStatistic.cellsLeft}
            </p>
            <p>
              Кораблів на полі збито: {opponentFieldStatistic.shipsDestroyed}
            </p>
          </span>
        </div>
        <table style={{ paddingLeft: "10%" }}>
          <tbody>
            {opponentCells.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() =>
                      handlePlayerAttack({ row: rowIndex, coll: colIndex })
                    }
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "1px solid black",
                      textAlign: "center",
                      cursor: "pointer",
                      alignItems: "center",
                      backgroundColor: getCellColor({
                        row: rowIndex,
                        col: colIndex,
                        isEnemyBoard: true,
                      }),
                    }}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpponentTable;
