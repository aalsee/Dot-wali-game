import React, { useState, useEffect, useRef } from 'react';
import "./App.css";

function Button({ id, onClick }) {
  return <button id={id} className="button" onClick={onClick}></button>;
}

function handleClick(user, setUser, id, points, setPoints,A,setA,B,setB, canvasRef) {
  const buttonElement = document.getElementById(id);
  const rect = buttonElement.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const len = points.length;
  if (len % 2 === 0) {
    setPoints([...points, { x, y }]);
  } else {
    const newPoint = { x, y };
    const lastPoint = points[len - 1];

    if (!lineExists(points, lastPoint, newPoint) && validDistance(lastPoint, newPoint)) {
      drawLine(lastPoint, newPoint, canvasRef);
      if(!checkForSquare(lastPoint, newPoint,points,user,setUser,A,setA,B,setB)){
        setUser(!user);
      }
      setPoints([...points, newPoint]);
    } else {
      setPoints(points.slice(0, len - 1));
    }
  }
}

function validDistance(point1, point2) {
  const val = calculateDistance(point1, point2);
  console.log(val);
  if (val && val < 24) {
    return true;
  }
  return false;
}

function calculateDistance(point1, point2) {
  const deltaX = point2.x - point1.x;
  const deltaY = point2.y - point1.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function lineExists(points, lastPoint, newPoint) {
  const existingLines = points.slice(0, points.length - 1);

  return existingLines.some((point, index) => {
    if (index % 2 === 0) {
      const nextPoint = existingLines[index + 1];

      return (
        (point.x === lastPoint.x && point.y === lastPoint.y && nextPoint.x === newPoint.x && nextPoint.y === newPoint.y) ||
        (point.x === newPoint.x && point.y === newPoint.y && nextPoint.x === lastPoint.x && nextPoint.y === lastPoint.y)
      );
    }
    return false;
  });
}

function drawLine(start, end, canvasRef) {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function isHorizontal(lastPoint, newPoint) {
  return lastPoint.y === newPoint.y;
}

function checkForSquare(lastPoint, newPoint, points,user,setUser,A,setA,B,setB) {
  const squareSize = 21.25;
  let flag = false;
  if (isHorizontal(lastPoint, newPoint)) {
    const topLeft = { x: lastPoint.x, y: lastPoint.y - squareSize };
    const topRight = { x: newPoint.x, y: newPoint.y - squareSize };
    if (
      lineExists(points, topLeft, topRight) &&
      lineExists(points, topLeft, lastPoint) &&
      lineExists(points, topRight, newPoint)
    ) {
      console.log("Square detected above!");
      if(user){
        setA(prevA => prevA + 1);
      }
      else{
        setB(prevB => prevB + 1);
      }
      flag = true;
    }
    const bottomLeft = { x: lastPoint.x, y: lastPoint.y + squareSize };
    const bottomRight = { x: newPoint.x, y: newPoint.y + squareSize };
    if (
      lineExists(points, bottomLeft, bottomRight) &&
      lineExists(points, bottomLeft, lastPoint) &&
      lineExists(points, bottomRight, newPoint)
    ) {
      console.log("Square detected below!");
      if(user){
        setA(prevA => prevA + 1);
      }
      else{
        setB(prevB => prevB + 1);
      }
      flag = true;
    }
  } else {
    const topLeft = { x: lastPoint.x - squareSize, y: lastPoint.y };
    const bottomLeft = { x: newPoint.x - squareSize, y: newPoint.y };
    if (
      lineExists(points, topLeft, bottomLeft) &&
      lineExists(points, topLeft, lastPoint) &&
      lineExists(points, bottomLeft, newPoint)
    ) {
      console.log("Square detected to the left!");
      if(user){
        setA(prevA => prevA + 1);
      }
      else{
        setB(prevB => prevB + 1);
      }
      flag = true;
    }
    const topRight = { x: lastPoint.x + squareSize, y: lastPoint.y };
    const bottomRight = { x: newPoint.x + squareSize, y: newPoint.y };
    if (
      lineExists(points, topRight, bottomRight) &&
      lineExists(points, topRight, lastPoint) &&
      lineExists(points, bottomRight, newPoint)
    ) {
      console.log("Square detected to the right!");
      if(user){
        setA(prevA => prevA + 1);
      }
      else{
        setB(prevB => prevB + 1);
      }
      flag = true;
    }
  }
  return flag;
}

const generateRows = (n) => {
  let count = 1;
  return Array.from({ length: n }, () => 
    Array.from({ length: n }, () => (count++).toString())
  );
};

export default function Board() {
  const [user, setUser] = useState(true);
  const [points, setPoints] = useState([]);
  const canvasRef = useRef(null);
  const [A,setA] = useState(0);
  const [B,setB] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  let n = 16;

  const rows = generateRows(n);
  
  return (
    <div className='Box'>
      <div className='Bada-container'>
        <div className="Container">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((id) => (
                <Button
                  key={id}
                  id={id}
                  onClick={() => handleClick(user, setUser, id, points, setPoints, A, setA, B, setB, canvasRef)}
                />
              ))}
            </div>
          ))}
        </div>
        <div>
          <h2>Turn: {user ? "A" : "B"}</h2>
          <h3>Points of A : {A}</h3>
          <h3>Points of B : {B}</h3>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />
    </div>
  );
}
