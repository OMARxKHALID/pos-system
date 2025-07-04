/**
 * Get category color classes for consistent styling across components
 * @param {string} categoryId - The category ID or name
 * @param {string} style - The style type: 'background', 'border', or 'both'
 * @returns {string} CSS classes for the category color
 */
export const getCategoryColor = (categoryId, style = "both") => {
  const colors = {
    all: {
      background: "bg-blue-50 text-blue-700 border-blue-100",
      border: "border-blue-200 text-blue-700 bg-transparent",
      both: "bg-blue-50 text-blue-700 border-blue-100",
    },
    burgers: {
      background: "bg-orange-50 text-orange-700 border-orange-100",
      border: "border-orange-200 text-orange-700 bg-transparent",
      both: "bg-orange-50 text-orange-700 border-orange-100",
    },
    pizza: {
      background: "bg-red-50 text-red-700 border-red-100",
      border: "border-red-200 text-red-700 bg-transparent",
      both: "bg-red-50 text-red-700 border-red-100",
    },
    drinks: {
      background: "bg-cyan-50 text-cyan-700 border-cyan-100",
      border: "border-cyan-200 text-cyan-700 bg-transparent",
      both: "bg-cyan-50 text-cyan-700 border-cyan-100",
    },
    desserts: {
      background: "bg-pink-50 text-pink-700 border-pink-100",
      border: "border-pink-200 text-pink-700 bg-transparent",
      both: "bg-pink-50 text-pink-700 border-pink-100",
    },
    appetizers: {
      background: "bg-green-50 text-green-700 border-green-100",
      border: "border-green-200 text-green-700 bg-transparent",
      both: "bg-green-50 text-green-700 border-green-100",
    },
    salads: {
      background: "bg-emerald-50 text-emerald-700 border-emerald-100",
      border: "border-emerald-200 text-emerald-700 bg-transparent",
      both: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    soups: {
      background: "bg-amber-50 text-amber-700 border-amber-100",
      border: "border-amber-200 text-amber-700 bg-transparent",
      both: "bg-amber-50 text-amber-700 border-amber-100",
    },
    pasta: {
      background: "bg-purple-50 text-purple-700 border-purple-100",
      border: "border-purple-200 text-purple-700 bg-transparent",
      both: "bg-purple-50 text-purple-700 border-purple-100",
    },
    seafood: {
      background: "bg-teal-50 text-teal-700 border-teal-100",
      border: "border-teal-200 text-teal-700 bg-transparent",
      both: "bg-teal-50 text-teal-700 border-teal-100",
    },
    chicken: {
      background: "bg-yellow-50 text-yellow-700 border-yellow-100",
      border: "border-yellow-200 text-yellow-700 bg-transparent",
      both: "bg-yellow-50 text-yellow-700 border-yellow-100",
    },
    beef: {
      background: "bg-rose-50 text-rose-700 border-rose-100",
      border: "border-rose-200 text-rose-700 bg-transparent",
      both: "bg-rose-50 text-rose-700 border-rose-100",
    },
    vegetarian: {
      background: "bg-lime-50 text-lime-700 border-lime-100",
      border: "border-lime-200 text-lime-700 bg-transparent",
      both: "bg-lime-50 text-lime-700 border-lime-100",
    },
    sides: {
      background: "bg-indigo-50 text-indigo-700 border-indigo-100",
      border: "border-indigo-200 text-indigo-700 bg-transparent",
      both: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    breakfast: {
      background: "bg-orange-50 text-orange-700 border-orange-100",
      border: "border-orange-200 text-orange-700 bg-transparent",
      both: "bg-orange-50 text-orange-700 border-orange-100",
    },
    lunch: {
      background: "bg-blue-50 text-blue-700 border-blue-100",
      border: "border-blue-200 text-blue-700 bg-transparent",
      both: "bg-blue-50 text-blue-700 border-blue-100",
    },
    dinner: {
      background: "bg-purple-50 text-purple-700 border-purple-100",
      border: "border-purple-200 text-purple-700 bg-transparent",
      both: "bg-purple-50 text-purple-700 border-purple-100",
    },
    snacks: {
      background: "bg-yellow-50 text-yellow-700 border-yellow-100",
      border: "border-yellow-200 text-yellow-700 bg-transparent",
      both: "bg-yellow-50 text-yellow-700 border-yellow-100",
    },
    beverages: {
      background: "bg-cyan-50 text-cyan-700 border-cyan-100",
      border: "border-cyan-200 text-cyan-700 bg-transparent",
      both: "bg-cyan-50 text-cyan-700 border-cyan-100",
    },
    coffee: {
      background: "bg-amber-50 text-amber-700 border-amber-100",
      border: "border-amber-200 text-amber-700 bg-transparent",
      both: "bg-amber-50 text-amber-700 border-amber-100",
    },
    tea: {
      background: "bg-green-50 text-green-700 border-green-100",
      border: "border-green-200 text-green-700 bg-transparent",
      both: "bg-green-50 text-green-700 border-green-100",
    },
    smoothies: {
      background: "bg-pink-50 text-pink-700 border-pink-100",
      border: "border-pink-200 text-pink-700 bg-transparent",
      both: "bg-pink-50 text-pink-700 border-pink-100",
    },
    juices: {
      background: "bg-orange-50 text-orange-700 border-orange-100",
      border: "border-orange-200 text-orange-700 bg-transparent",
      both: "bg-orange-50 text-orange-700 border-orange-100",
    },
  };

  // For unknown categories, generate a color based on the category name
  if (!colors[categoryId]) {
    const colorOptions = {
      background: [
        "bg-blue-50 text-blue-700 border-blue-100",
        "bg-green-50 text-green-700 border-green-100",
        "bg-purple-50 text-purple-700 border-purple-100",
        "bg-pink-50 text-pink-700 border-pink-100",
        "bg-indigo-50 text-indigo-700 border-indigo-100",
        "bg-teal-50 text-teal-700 border-teal-100",
        "bg-amber-50 text-amber-700 border-amber-100",
        "bg-emerald-50 text-emerald-700 border-emerald-100",
        "bg-rose-50 text-rose-700 border-rose-100",
        "bg-lime-50 text-lime-700 border-lime-100",
      ],
      border: [
        "border-blue-200 text-blue-700 bg-transparent",
        "border-green-200 text-green-700 bg-transparent",
        "border-purple-200 text-purple-700 bg-transparent",
        "border-pink-200 text-pink-700 bg-transparent",
        "border-indigo-200 text-indigo-700 bg-transparent",
        "border-teal-200 text-teal-700 bg-transparent",
        "border-amber-200 text-amber-700 bg-transparent",
        "border-emerald-200 text-emerald-700 bg-transparent",
        "border-rose-200 text-rose-700 bg-transparent",
        "border-lime-200 text-lime-700 bg-transparent",
      ],
      both: [
        "bg-blue-50 text-blue-700 border-blue-100",
        "bg-green-50 text-green-700 border-green-100",
        "bg-purple-50 text-purple-700 border-purple-100",
        "bg-pink-50 text-pink-700 border-pink-100",
        "bg-indigo-50 text-indigo-700 border-indigo-100",
        "bg-teal-50 text-teal-700 border-teal-100",
        "bg-amber-50 text-amber-700 border-amber-100",
        "bg-emerald-50 text-emerald-700 border-emerald-100",
        "bg-rose-50 text-rose-700 border-rose-100",
        "bg-lime-50 text-lime-700 border-lime-100",
      ],
    };

    // Generate a consistent color based on the category name
    const hash = categoryId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % colorOptions[style].length;
    return colorOptions[style][index];
  }

  return colors[categoryId][style] || colors[categoryId].both;
};
