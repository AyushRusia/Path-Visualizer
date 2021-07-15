function Generate() {
  const size = document.getElementById("size").value;
  var arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size);
    for (let j = 0; j < size; j++) {
      arr[i][j] =
        Math.random() < 0.60 ? 0 : Math.floor(Math.random() * size * 3 + 1);
    }
  }
  let grid = document.createElement("TABLE");
  grid.setAttribute("id", "grid");
  grid.setAttribute("class", "grid");

  for (let i = 0; i < size; i++) {
    let row = document.createElement("TR");
    row.setAttribute("class", "row");
    for (let j = 0; j < size; j++) {
      let column = document.createElement("TD");
      column.setAttribute("class", "cloumn");
      column.setAttribute("id", size * i + j);
      column.innerHTML = arr[i][j];
      row.appendChild(column);
    }
    grid.appendChild(row);
  }
  document.getElementById("Main").appendChild(grid);
  document.getElementById("generate").disabled = true;
}

async function animation(size, i, j, color1, color2, delay) {
  const prevColor = document.getElementById(size * i + j).style.backgroundColor;
  document.getElementById(size * i + j).style.backgroundColor = color1;
  await new Promise((resolve) =>
    setTimeout(() => {
      document.getElementById(size * i + j).style.backgroundColor = color2
        ? color2
        : prevColor;
      resolve();
    }, delay)
  );
}
async function findMax(values, i, j, size) {
  if (i >= 0 && j >= 0 && i < size && j < size) {
    //base case
    if (values[i][j] == 0) {
      //await animation(size, i, j, "red", null, 300); //Invalid Move
      return 0;
    }

    const temp = values[i][j];
    values[i][j] = 0; //back tracking
    const oldcolor = document.getElementById(size * i + j).style
      .backgroundColor;
    await animation(size, i, j, "blue", null, 00); //Traversing Move
    let sum =
      temp +
      Math.max(
        await findMax(values, i - 1, j, size),
        await findMax(values, i + 1, j, size),
        await findMax(values, i, j - 1, size),
        await findMax(values, i, j + 1, size)
      );
    await animation(size, i, j, oldcolor, oldcolor, 0);
    values[i][j] = temp;
    //await animation(size, i, j, "white", 0); //checking ends
    return sum;
  } else return 0;
}
async function findPath() {
  const size = document.getElementById("size").value;
  console.log(size);
  let values = new Array(size);
  for (let i = 0; i < size; i++) {
    values[i] = new Array(size);
    for (let j = 0; j < size; j++)
      values[i][j] = parseInt(document.getElementById(size * i + j).innerHTML);
  }

  let currMaxSumDetails = [0, 0, 0]; //[sum,i,j]
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (values[i][j] != 0) {
        await animation(size, i, j, "yellow", "yellow", 00); //tells checking for value[i][j]
        const Sum = await findMax(values, i, j, size);
        if (Sum > currMaxSumDetails[0]) {
          await animation(
            size,
            currMaxSumDetails[1],
            currMaxSumDetails[2],
            "pink",
            "pink",
            0
          ); //maxValue
          currMaxSumDetails = [Sum, i, j];
        }
      }
      await animation(size, i, j, "pink", "pink", 0); //ttraversed value[i][j]
      await animation(
        size,
        currMaxSumDetails[1],
        currMaxSumDetails[2],
        "green",
        "green",
        0
      ); //maxValue
    }
  }
  await HighlightMax(
    values,
    currMaxSumDetails[1],
    currMaxSumDetails[2],
    size,
    currMaxSumDetails[0]
  );
}
async function findSum(values, i, j, size) {
  if (i >= 0 && j >= 0 && i < size && j < size) {
    if (values[i][j] === 0) return 0;
    else {
      const temp = values[i][j];
      values[i][j] = 0;
      let sum =
        temp +
        Math.max(
          await findSum(values, i - 1, j, size),
          await findSum(values, i + 1, j, size),
          await findSum(values, i, j - 1, size),
          await findSum(values, i, j + 1, size)
        );
      values[i][j] = temp;
      return sum;
    }
  } else return 0;
}
async function HighlightMax(values, i, j, size, sum) {
  const temp = values[i][j];
  values[i][j] = 0;
  console.log(sum);
  if (i < 0 || j < 0 || i > size || j > size) return;
  if (sum == temp) return;
  else if (sum - temp == (await findSum(values, i - 1, j, size))) {
    console.log("i-1");
    await animation(size, i - 1, j, "grey", "grey", 10);
    await HighlightMax(values, i - 1, j, size, sum - temp);
  } else if (sum - temp == (await findSum(values, i + 1, j, size))) {
    console.log("i+1");
    await animation(size, i + 1, j, "grey", "grey", 10);
    await HighlightMax(values, i + 1, j, size, sum - temp);
  } else if (sum - temp == (await findSum(values, i, j - 1, size))) {
    console.log("j-1");
    await animation(size, i, j - 1, "grey", "grey", 10);
    await HighlightMax(values, i, j - 1, size, sum - temp);
  } else if (sum - temp == (await findSum(values, i, j + 1, size))) {
    console.log("j+1");
    await animation(size, i, j + 1, "grey", "grey", 10);
    await HighlightMax(values, i, j + 1, size, sum - temp);
  } else console.log(sum - temp);
}
