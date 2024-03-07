class Data {
  constructor() {
    this.data =  [{
      "question": "Is she happy?",
      "options": ["Yes, she is.", "No, she isn't.", "Yes, she not.", "No, she is."],
      "correct_answer": "Yes, she is."
    },
    {
      "question": "Are they sad?",
      "options": ["No, they is.", "Yes, they not.", "Yes, they are.", "No, they not."],
      "correct_answer": "No, they aren't."
    }
    ];
  }

  addToLocalStorage(key) {
    try {
      // Convert data to JSON format before storing
      const levelData = this.data
      const jsonData = JSON.stringify(levelData);
      
      // Store the data in localStorage
      localStorage.setItem(key, jsonData);

      console.log(`Data with key '${key}' added to localStorage.`);
    } catch (error) {
      console.error('Error adding data to localStorage:', error);
    }
  }
  
  getLevelData(key, level) {
    try {
      // Retrieve data from localStorage
      const jsonData = localStorage.getItem(key)[level];

      // Parse the JSON data
      const data = JSON.parse(jsonData);

      console.log(`Data for level '${level}' fetched from localStorage:`, data);
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching data from localStorage:', error);
    }
  }
  
}