const data = [
    {
        // Just one right answer (b)
        question: "What is the purpose of electrolyte fluid in a polarographic dissolved oxygen meter?",
        options: [
            "It produces electrolytes which change the chemistry of the water to improve it.",
            "It allows oxygen to pass through the membrane and be recognized by the sensor.",
            "It helps keep the probe tip oriented."
        ],
        correct_option: "It allows oxygen to pass through the membrane and be recognized by the sensor."
    },
    {
        // Just one right answer (c)
        question: "Why do you have to 'jig' (the regular action of raising and lowering) the probe in the water about an inch to five inches?",
        options: [
            "It ensures you are at the correct depth",
            "To scare away fish",
            "To flush water by the probe end",
            "To lure fish"
        ],
        correct_option: "To flush water by the probe end"
    },
    {
        // Correct answers are b and d
        question: "How many QA readings should you take?",
        options: [
            "1 for every depth (readings of 0m through 20m means 21 QA readings)",
            "1 for every 10 depth readings (readings of 0m through 20m means 3 QA readings)",
            "1 for every 10 meters (readings of 0 m through 20m means 2 QA readings)",
            "1 for every 10 depth readings (readings of 0m through 37m skipping the even meters after 15 meters of depth means 4 QA readings)",
            "1 for every 10 meter readings (readings of 0m through 37m skipping the even meters after 15 meters of depth means 3 QA readings)"
        ],
        correct_option: "1 for every 10 meters (readings of 0 m through 20m means 2 QA readings)"
    },
    {
        // Correct answers are c and d
        question: "Why do optical meters not need to be 'jigged'?",
        options: [
            "It doesn’t effectively scare the fish",
            "It causes significant instability",
            "It uses a diode and sensor cap to read the oxygen concentration",
            "It doesn’t consume oxygen as it takes a reading"
        ],
        correct_option: "It doesn’t consume oxygen as it takes a reading"
    },
    {
        // Correct answers are a and c
        question: "Why shouldn’t you take a quality assurance (QA) sample in the thermocline or at the surface?",
        options: [
            "It has a higher likelihood of instability so your readings are less likely to match.",
            "It could get gunked up.",
            "It can have natural undulations in causing issues of instability."
        ],
        correct_option: "It has a higher likelihood of instability so your readings are less likely to match."
    }    
];

export default data;
