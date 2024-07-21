
export const pnt = [
    {
      "prompt": "I am a newbie and looking help, How can you help?",
      "title": "Seek Help!"
    },
    {
      "prompt": "Give me a weekly plan for lower body strength training formatted as a table",
      "title": "Training Plan"
    },
    {
      "prompt": "What impact does iron deficiency have on running?",
      "title": "Nutrition"
    },
    {
      "prompt": "Explain theory of Relativity",
      "title": "Off Topic"
    },
    {
      "prompt": "Write a sysnopsis on Chaos Theory",
      "title": "Off Topic"
    },
    {
      "prompt": "What is Quantum Computing?" ,
      "title": "Off Topic"
    },
    {
      "prompt": "What are some common mistakes to avoid when doing squats?",
       "title": "Exercise Technique"
    },
    {
      "prompt": "How can I improve my flexibility for running?",
      "title": "Flexibility"
    },
    {"prompt": "What mental strategies can help me push through the toughest parts of long-distance races?",
      "title": "Mental Strategies"
      },
    {"prompt":"How can I maintain motivation and focus during the final stages of a marathon or ultra-marathon?",
      "title": "Mental Strategies"
      },
      {
        "prompt":"What advanced strength training exercises can enhance my performance in long-distance running?",
        "title": "Strength Training"
      },
      {
        "prompt":"How can I balance strength training with my high-mileage weeks to avoid burnout?",
        "title": "Strength Training"
      },
      {"prompt":"What nutritional strategies can help improve my endurance and performance in longer races?",
        "title": "Nutrition"
      },
{"prompt":"How should I adjust my diet and hydration strategy during the tapering phase before a long-distance race?",
  "title": "Nutrition"
},
{"prompt":"What advanced techniques can I use to prevent overuse injuries as I increase my mileage?",
  "title": "Injury Prevention"},
{"prompt":"How can I identify and address the early signs of common injuries like IT band syndrome or plantar fasciitis?",
  "title": "Injury Prevention"
},
{"prompt":"How can I effectively transition from half marathon training to full marathon training?",
  "title": "Training"
},
{"prompt":"What are some effective strategies for incorporating speed work into my long-distance training plan?",
  "title": "Training"},
  {"prompt":"What are some effective strategies to speed up my recovery from hard workouts",
    "title": "Recovery"
  }
    
  ]



function random(m, n) {
  let result = [];
  for (let i = 0; i < n; i++) {
      let randomInt = Math.floor(Math.random() * m);
      if (result.includes(randomInt)) { // there is possibility that we will get a shorter array than n
          randomInt = Math.floor(Math.random() * m);
      }
      result.push(randomInt);
  }
  return result;
}


export function randomSplit(arr, n) {
  const trainSet = [];
  const valSet = [];
  const valIdx = random(arr.length,n); // random indices for valset

  for (let i = 0; i < arr.length; i++) {
      if (valIdx.includes(i)) {
          valSet.push(arr[i]);
      } else {
          trainSet.push(arr[i]);
      }
  }

  return [trainSet, valSet];
}


