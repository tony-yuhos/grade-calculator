'use client'
import styles from './page.module.css'
import { useState } from 'react';

/*
TODO:
  - Add name option for score table (organization for user)
  - Create limits on enterable values
  - Rounding on displays (title attribute to show full value..?)

  -Making things look nicer (random gaps and shit...)
  -Title, description, and other user-friendly things
*/

function ScoreTable({scoreList, cats, handleChange }) {

  const choices = cats.map((cat, index) => {

    return (
      <option key={index}>{cat.name}</option>
    );
  });

  const scoreContent = scoreList.map((score, index) => {

    return (
      <tr key={index}>
        <td><input type="number" onChange={(event) => handleChange(0, index, event)}></input></td>
        <td><input type="number" onChange={(event) => handleChange(1, index, event)}></input></td>
        <td>
          <select onChange={(event) => handleChange(2, index, event)}>
            <option key={-1}>Choose...</option>
            {choices}
          </select>
        </td>
      </tr>
    );
  });

  return (
    <>

      <table>
        <thead>
          <tr>
            <th>Actual Points</th>
            <th>Possible Points</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {scoreContent}
        </tbody>
      </table>
    </>
  );
}

function CategoryTable({ scoreList, cats, handleChange }) {

  const catContent = cats.map((cat, index) => {
    return (
      <tr key={index}>
        <td><input type="text" onChange={(event) => handleChange(true, index, event)}></input></td>
        <td><input type="number" onChange={(event) => handleChange(false, index, event)}></input></td>
        <td>{cat.grade}</td>
      </tr>
    );
  });
  
  return (  
    <table className={styles.categoryTable}>
      <thead>
        <tr>
          <th>Category</th>
          <th>Weight</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {catContent}
      </tbody>
    </table>
  )
}

function GradeTable({ cats }) {
  
  let grade = 0;

  for (const cat of cats) {
    grade = grade + cat.grade*cat.weight;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Total Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{grade}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Home() {
  class Score {
    constructor(actual, possible, category) {
      this.actual = actual;
      this.possible = possible;
      this.cat = category;
    }
  }
  
  class Cat {
    constructor(catName, catWeight, catGrade) {
      this.name = catName;
      this.weight = catWeight;
      this.grade = catGrade;
    }
  }

  const [categories, setCategories] = useState([]);
  const [scores, setScores] = useState([new Score(0, 0, '')]);

  function calcCatGrade(scores, cat) {

    let actual = 0;
    let possible = 0;
  
    for (const score of scores) {
      console.log(score);
      if (score.cat === cat.name) {
        actual = actual + score.actual;
        possible = possible + score.possible;
      }
    }
  
    let result = actual/possible;
  
    if (!isFinite(result)) {
      result = 0;
    }
  
    return result;
  }

  function addScore() {
    setScores([...scores, new Score(0, 0, '')]);
  }

  function addCategory() {
    setCategories([...categories, new Cat('', 0, 0)]);
  }

  function onScoreChange(typeChange, i, event) {

    const currentScore = scores[i];

    switch (typeChange) {
      case 0:
        currentScore.actual = Number(event.target.value);
        break;
      case 1:
        currentScore.possible = Number(event.target.value);
        break;
      case 2:
        currentScore.cat = event.target.value;
    }

    const newScores = [...scores.slice(0, i), currentScore, ...scores.slice(i+1)];

    setScores(newScores);

    const newCategories = categories.slice(0);

    for (const cat of newCategories) {
      cat.grade = calcCatGrade(scores, cat);
    }
    
    setCategories(newCategories);
  }

  function onCatChange(nameChange, i, event) {

    const currentCat = categories[i];

    if (nameChange) {
      currentCat.name = event.target.value;
    } else {
      currentCat.weight = Number(event.target.value);
    }

    currentCat.grade = calcCatGrade(scores, currentCat);

    const newCategories = [...categories.slice(0, i), currentCat, ...categories.slice(i+1)];

    setCategories(newCategories);
  }

  return (

    <div className={styles.calc}>
      <div>
        <ScoreTable scoreList ={scores} cats={categories} handleChange={onScoreChange}/>
        <button onClick={addScore}>Add Score</button>
      </div>
      <div className = {styles.rightDiv}>
        <CategoryTable scoreList={scores} cats={categories} handleChange={onCatChange}/>
        <button onClick={addCategory}>Add Category</button>
      </div>
      <div className={styles.rightDiv}>
        <GradeTable cats={categories} />
      </div>
    </div>
    
  );
}