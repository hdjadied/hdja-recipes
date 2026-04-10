import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
  images: string[];
};

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4567/ingredients")
      .then((r) => r.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Fetch all recipes to extract unique tags
    fetch("http://localhost:4567/search?q=")
      .then((r) => r.json())
      .then((recipes: Recipe[]) => {
        const tags = Array.from(new Set(recipes.flatMap((r) => r.tags)));
        setAllTags(tags);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selected.length === 0) return;

    const timeout = setTimeout(() => {
      const fetchData = async () => {
        const query = selected.join(" ");
        const res = await fetch(
          `http://localhost:4567/fridge?i=${encodeURIComponent(query)}`
        );
        const data: Recipe[] = await res.json();
        setRecipes(filterByTags(data));
      };

      fetchData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [selected, selectedTags]);

  const searchRecipes = async () => {
    if (!query.trim()) return;

    const res = await fetch(
      `http://localhost:4567/search?q=${encodeURIComponent(query)}`
    );
    const data: Recipe[] = await res.json();
    setRecipes(filterByTags(data));
  };

  const handleSearchInput = (value: string) => {
    setQuery(value);
    
    // Auto-search after 3 characters
    if (value.trim().length >= 3) {
      const fetchSearch = async () => {
        const res = await fetch(
          `http://localhost:4567/search?q=${encodeURIComponent(value)}`
        );
        const data: Recipe[] = await res.json();
        setRecipes(filterByTags(data));
      };
      fetchSearch();
    }
  };

  const filterByTags = (recipesToFilter: Recipe[]) => {
    if (selectedTags.length === 0) return recipesToFilter;
    return recipesToFilter.filter((recipe) =>
      selectedTags.some((tag) => recipe.tags.includes(tag))
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const fetchRandomRecipe = async () => {
    const res = await fetch("http://localhost:4567/random");
    const data: Recipe = await res.json();
    setRecipes([data]);
  };

  const toggleIngredient = (ingredient: string) => {
    setSelected((prev) =>
      prev.includes(ingredient)
        ? prev.filter((x) => x !== ingredient)
        : [...prev, ingredient]
    );
  };

  const visibleIngredients = expanded
    ? ingredients
    : ingredients.slice(0, 12);

function RecipeItem({ recipe }: { recipe: Recipe }) {
  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () => setImageIndex((prev) => (prev + 1) % recipe.images.length);
  const prevImage = () => setImageIndex((prev) => (prev - 1 + recipe.images.length) % recipe.images.length);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "8px",
      }}
    >
      <h2>{recipe.title}</h2>

      {recipe.images.length > 0 && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={`http://localhost:4567${recipe.images[imageIndex]}`}
            alt={recipe.title}
            style={{
              width: "100%",
              maxWidth: "300px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
          {recipe.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                }}
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                }}
              >
                ›
              </button>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {recipe.images.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setImageIndex(i)}
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: i === imageIndex ? "#ad4caf" : "#ccc",
                      margin: "0 5px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <p>
        <b>cook time:</b> {recipe.cookTime} | <b>servings:</b> {recipe.servings}
      </p>

      <p>
        <b>ingredients:</b>{" "}
        {recipe.ingredients.map((ing) => {
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
        <b>instructions:</b> {recipe.instructions}
      </p>

      <p>
        <b>tags:</b> {recipe.tags.join(", ")}
      </p>
    </div>
  );
}

  return (
    <div style={{ padding: "40px" }}>
      <header className="top">
        <div className="title">
          <h1><Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>hdja recipies</Link></h1>
          <p>all my recipes written on scraps piece of paper in a webpage</p>
        </div>

        <div className="links">
          <div>
            <h4>contacts</h4>
            <a href="mailto:heidija.birzniece@gmail.com">
              heidija.birzniece@gmail.com
            </a>
          </div>

          <div>
            <h4>hdja etc.</h4>
            <a href="https://linkedin.com/in/heidija-b-aa837a388/" target="_blank">
              linkedin
            </a>
            <br />
            <a href="https://github.com/hdjadied" target="_blank">
              github
            </a>
          </div>

          <div>
            <h4><Link to="/tats" style={{ textDecoration: "none", color: "inherit" }}>hdja tats</Link></h4>
            <Link to="/tats#portfolio" style={{ textDecoration: "none", color: "inherit", display: "block", marginBottom: "4px" }}>portfolio</Link>
            <Link to="/tats#available-flash" style={{ textDecoration: "none", color: "inherit", display: "block", marginBottom: "4px" }}>available flash</Link>
            <Link to="/tats#fresh-healed" style={{ textDecoration: "none", color: "inherit" }}>fresh/healed</Link>
          </div>
        </div>
      </header>

      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="search recipes..."
          value={query}
          onChange={(e) => handleSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchRecipes()}
          style={{ padding: "6px 10px", width: "250px", marginRight: "10px" }}
        />
        <button onClick={searchRecipes}>search</button>
        <button onClick={fetchRandomRecipe} style={{ marginLeft: "10px" }}>
          random recipe button
        </button>
      </div>

      {allTags.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <p style={{ marginBottom: "10px", fontWeight: "bold" }}>Filter by tags:</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "6px 12px",
                  background: selectedTags.includes(tag) ? "#ad4caf" : "#f0f0f0",
                  color: selectedTags.includes(tag) ? "white" : "#000",
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: selectedTags.includes(tag) ? "bold" : "normal",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "white",
            padding: "10px 0",
            zIndex: 10,
            borderBottom: "1px solid #ddd",
            marginBottom: "20px",
          }}
        >
          <b>selected:</b>{" "}
          {selected.map((s) => (
            <span key={s} style={{ marginRight: "8px", color: "#ad4caf" }}>
              {s}
            </span>
          ))}
          <button
            onClick={() => setSelected([])}
            style={{ marginLeft: "10px" }}
          >
            clear all
          </button>
        </div>
      )}

      <h2>sooo.. what do you have at hand?</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        {visibleIngredients.map((i) => {
          const isSelected = selected.includes(i);
          return (
            <div
              key={i}
              onClick={() => toggleIngredient(i)}
              style={{
                padding: "6px 12px",
                borderRadius: "16px",
                border: `1px solid ${isSelected ? "#ad4caf" : "#ccc"}`,
                backgroundColor: isSelected ? "#f1a5e2" : "#f0f0f0",
                color: "#94417c",
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              {i}
            </div>
          );
        })}
      </div>

      {ingredients.length > 12 && (
        <button onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? "show less" : "more ingredients..."}
        </button>
      )}

      <div style={{ marginTop: "30px" }}>
        {recipes.map((r) => (
          <RecipeItem key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}

export default App;
