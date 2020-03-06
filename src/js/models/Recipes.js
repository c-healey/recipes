import axios from "axios";
export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.image = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert(`Something went wrong :(`);
    }
  }
  calcTime() {
    // Assuming tha we need 15 minutes for each 3 ingredients or 5 minutes per ingredient
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServing() {
    this.servings = 4;
  }
  parseIngredient() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredient = this.ingredients.map(el => {
      //   uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // ?remove ()

      // parse ingredients into count unit and this.ingredients
      let arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
      let objIng;

      if (unitIndex > -1) {
        //   there is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        objIng = {
          count: eval(
            arrIng.slice(0, unitIndex) === 1
              ? arrIng[0].replace("-", "+")
              : arrIng.slice(0, unitIndex).join("+")
          ),
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        //   ?there is no unit just a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        //   no unit or number
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }
      return objIng;
    });
    this.ingredients = newIngredient;
  }
  updateServings(type) {
    // servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
    // ingredients
    this.ingredients.forEach(ing => {
      ing.count *= newServings / this.servings;
      Math.round(ing.count * 100) / 100;
    });

    this.servings = newServings;
  }
}
