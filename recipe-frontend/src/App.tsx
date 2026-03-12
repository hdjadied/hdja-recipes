import { useState, useEffect } from "react";

type Ingredient = {
  name: string;
  quantity?: number;
  unit?: string;
};

type Recipe = {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  cookTime: string;
  servings: number;
  tags: string[];
  image?: string;
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
    <div style={{ padding: "40px" }}>
      <header className="top">
  <div className="title">
    <h1>hdja recipies</h1>
    <p>all my recipes written on scraps piece of paper in a webpage</p>
  </div>

  <div className="links">
    <div>
      <h4>contacts</h4>
      <a href="mailto:heidija.birzniece@gmail.com">heidija.birzniece@gmail.com</a>
    </div>

    <div>
      <h4>hdja etc.</h4>
      <a href="https://linkedin.com/in/heidija-b-aa837a388/" target="_blank">linkedin</a>
      <br />
      <a href="https://github.com/hdjadied" target="_blank">github</a>
    </div>

    <div>
      <h4>hdja tats</h4>
      <p>portfolio</p>
      <p>available flash</p>
      <p>fresh/healed</p>
    </div>
  </div>
</header>
      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchRecipes()}
          style={{ padding: "6px 10px", width: "250px", marginRight: "10px" }}
        />
        <button onClick={searchRecipes}>search</button>
        <button onClick={fetchRandomRecipe} style={{ marginLeft: "10px" }}>
          random recipe button
        </button>
      </div>

      <h2>sooo.. what do you have at hand?</h2>
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
                border: `1px solid ${isSelected ? "#ad4caf" : "#ccc"}`,
                backgroundColor: isSelected ? "#ad4caf" : "#f0f0f0",
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
      <button onClick={searchFridge}>find recipes by selected ingredients</button>

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
            {r.image && (
              <img
                src={r.image}
                alt={r.title}
                style={{ width: "100%", maxWidth: "300px", borderRadius: "8px", marginBottom: "10px" }}
              />
            )}
            <p>
              <b>cook time:</b> {r.cookTime} | <b>servings:</b> {r.servings}
            </p>
            <p>
              <b>ingredients:</b>{" "}
              {r.ingredients.map((ing) => {
                const has = selected.includes(ing.name);
                return (
                  <span
                    key={ing.name}
                    style={{
                      marginRight: "4px",
                      color: has ? "#ad4caf" : "#000",
                      fontWeight: has ? "bold" : "normal",
                    }}
                  >
                    {ing.quantity ? `${ing.quantity}${ing.unit ?? ""} ` : ""}
                    {ing.name}
                  </span>
                );
              })}
            </p>
            <p>
              <b>instructions:</b> {r.instructions}
            </p>
            <p>
              <b>tags:</b> {r.tags.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;