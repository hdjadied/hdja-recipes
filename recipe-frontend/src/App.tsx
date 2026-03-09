import { useState, useEffect } from "react";

type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  cookTime: string;
  servings: number;
  tags: string[];
};

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:4567/ingredients")
      .then((r) => r.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

  const searchRecipes = async () => {
    if (!query.trim()) return;

    const res = await fetch(
      `http://localhost:4567/search?q=${encodeURIComponent(query)}`
    );
    const data: Recipe[] = await res.json();
    setRecipes(data);
  };

  const fetchRandomRecipe = async () => {
    const res = await fetch("http://localhost:4567/random");
    const data: Recipe = await res.json();
    setRecipes([data]);
  };

  const searchFridge = async () => {
    if (selected.length === 0) return;

    const query = selected.join(" ");
    const res = await fetch(
      `http://localhost:4567/fridge?i=${encodeURIComponent(query)}`
    );
    const data: Recipe[] = await res.json();
    setRecipes(data);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "40px" }}>
      <h1>Recipe Search</h1>

      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchRecipes()}
          style={{ padding: "6px 10px", width: "250px", marginRight: "10px" }}
        />
        <button onClick={searchRecipes}>Search</button>
        <button onClick={fetchRandomRecipe} style={{ marginLeft: "10px" }}>
          🎲 Random Recipe
        </button>
      </div>

      <h2>What's in your fridge?</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
        {ingredients.map((i) => {
          const isSelected = selected.includes(i);
          return (
            <div
              key={i}
              onClick={() =>
                setSelected(
                  isSelected
                    ? selected.filter((x) => x !== i)
                    : [...selected, i]
                )
              }
              style={{
                padding: "6px 12px",
                borderRadius: "16px",
                border: `1px solid ${isSelected ? "#4caf50" : "#ccc"}`,
                backgroundColor: isSelected ? "#4caf50" : "#f0f0f0",
                color: isSelected ? "white" : "black",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {i}
            </div>
          );
        })}
      </div>
      <button onClick={searchFridge}>Find Recipes</button>

      <div style={{ marginTop: "30px" }}>
        {recipes.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h2>{r.title}</h2>
            <p>
              <b>Cook time:</b> {r.cookTime} | <b>Servings:</b> {r.servings}
            </p>
            <p>
              <b>Ingredients:</b>{" "}
              {r.ingredients.map((ing) => {
                const has = selected.includes(ing);
                return (
                  <span
                    key={ing}
                    style={{
                      marginRight: "4px",
                      color: has ? "#4caf50" : "#000",
                      fontWeight: has ? "bold" : "normal",
                    }}
                  >
                    {ing}
                  </span>
                );
              })}
            </p>
            <p>
              <b>Instructions:</b> {r.instructions}
            </p>
            <p>
              <b>Tags:</b> {r.tags.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;