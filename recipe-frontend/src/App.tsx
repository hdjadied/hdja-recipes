import { useState } from "react";

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
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const searchRecipes = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:4567/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) {
        console.error('Fetch failed:', res.status, res.statusText);
        return;
      }
      const data: Recipe[] = await res.json();
      console.log('Fetched data:', data);
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "40px" }}>
      <h1>Recipe Search</h1>

      <input
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
      />

      <button onClick={searchRecipes}>Search</button>

      <div style={{ marginTop: "20px" }}>
        {recipes.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h2>{r.title}</h2>

            <p>
              <b>Cook time:</b> {r.cookTime} | <b>Servings:</b> {r.servings}
            </p>

            <p>
              <b>Ingredients:</b> {r.ingredients.join(", ")}
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