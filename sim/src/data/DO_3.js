const data = [
    {
      question: "Which of the following are essential to the acceptance and certification of temperature and dissolved oxygen (DO) data gathered by LSM volunteers?",
      options: [
        "Attendance at a LSM DO training and certification workshop.",
        "Checking the DO meter calibration box on the DO field form.",
        "Taking and recording at least one set of duplicate temp and DO readings for every 10 readings in your profile.",
        "All of the above."
      ],
      correct_option: ["All of the above."]
    },
    {
      question: "Which of the following are good practices to follow prior to using your DO meter at the onset of the monitoring season? Please select all that are true.",
      options: [
        "Check, and ideally, install a new set of batteries in the meter.",
        "For DO meters that use a polarographic sensor (meters with probes that use membranes, membrane caps, and electrolyte) check the condition of the sensor electrodes for evidence of oxidation, and if present, seek assistance in the removal of the oxidized material. If the electrodes are bright and shiny, install fresh electrolyte and a new membrane cap.",
        "Check the accuracy of the depth calibration markers on the sensor/probe cable.",
        "Buy a new probe.",
        "Calibrate the meter, in accordance with the instructions provided for your instrument.",
        "Ensure that the sponge in the probe/sensor calibration sleeve is moist (but there is no standing water)."
      ],
      correct_option: [
        "Check, and ideally, install a new set of batteries in the meter.",
        "For DO meters that use a polarographic sensor (meters with probes that use membranes, membrane caps, and electrolyte) check the condition of the sensor electrodes for evidence of oxidation, and if present, seek assistance in the removal of the oxidized material. If the electrodes are bright and shiny, install fresh electrolyte and a new membrane cap.",
        "Check the accuracy of the depth calibration markers on the sensor/probe cable.",
        "Calibrate the meter, in accordance with the instructions provided for your instrument.",
        "Ensure that the sponge in the probe/sensor calibration sleeve is moist (but there is no standing water)."
      ]
    },
    {
      question: "The environment in which you calibrate your DO meter can be critical to a successful and accurate calibration process. Which of the following environments is optimum for calibration?",
      options: [
        "In the boat, out on the lake, close to where actual readings will be taken.",
        "Calibration with the probe/sensor in the water, near the surface.",
        "In an indoor environment out of direct sunlight, where the air temperature is stable."
      ],
      correct_option: ["In an indoor environment out of direct sunlight, where the air temperature is stable."]
    },
    {
      question: "If you are using a dissolved oxygen meter which uses a polarographic probe/sensor (membrane / membrane cap; electrolyte solution; electrodes), how frequently should the membrane cap (or membrane for older models) and the electrolyte be replaced?",
      options: [
        "Only at the beginning of each lake monitoring season.",
        "Each time the meter is used.",
        "Only when you are unable to calibrate your meter.",
        "Once at the beginning of each monitoring season. And again during the season, as a first troubleshooting step if you experience an error message when attempting to calibrate, or DO readings become erratic or questionable.",
        "Never, unless damage has occurred to the sensor/probe."
      ],
      correct_option: ["Once at the beginning of each monitoring season. And again during the season, as a first troubleshooting step if you experience an error message when attempting to calibrate, or DO readings become erratic or questionable."]
    },
    {
      question: "DO meter failure on the water often occurs as the probe/sensor is under increasing pressure in the deep-water environment. Which of the following might lead you to believe that this has occurred with your equipment?",
      options: [
        "The readings on the screen is erratic, or ‘freezes up’ when you get below the epilimnion.",
        "The water temperature increases as the probe is lowered deeper down.",
        "You are unable to obtain acceptable duplicate temp and/or DO readings, and you have determined that a number of the original readings have also changed substantially.",
        "Both temperature and DO readings below the epilimnion are unusually high or low for your lake.",
        "Any or all of the above are possible."
      ],
      correct_option: ["Any or all of the above are possible."]
    },
    {
      question: "Assuming proper maintenance and calibration of your DO meter, what ‘rule of thumb’ can be used as a preliminary indicator of proper calibration and function of your equipment?",
      options: [
        "The DO reading, taken at 1.0 meter depth is close to 100% saturation, relative to the water temperature (with some exceptions).",
        "Temperature and DO readings are approximately equal.",
        "The DO reading is the same as the reading when the meter was calibrated."
      ],
      correct_option:  ["The DO reading, taken at 1.0 meter depth is close to 100% saturation, relative to the water temperature (with some exceptions)."]
    },
    {
      question: "Your dissolved oxygen meter may provide optional ways of displaying the amount of dissolved oxygen in the water. Which of these units should be the ones used and recorded on LSM data sheets?",
      options: [
        "Percent saturation to the nearest tenth of a whole number.",
        "Actual DO concentration to the nearest tenth of a milligram per liter (mg/l) aka: parts per million.",
        "Either is acceptable."
      ],
      correct_option: ["Actual DO concentration to the nearest tenth of a milligram per liter (mg/l) aka: parts per million."]
    },
    {
      question: "If you use a meter that uses an optical process to monitor DO (ODO units), which of the following maintenance procedures is critically important to the longevity of the sensor/probe unit?",
      options: [
        "The battery must be constantly charged.",
        "The sensor/probe cap must be kept dry when not in use.",
        "The sensor/probe cap must be kept continuously moist when not in use."
      ],
      correct_option:  ["The sensor/probe cap must be kept continuously moist when not in use."]
    },
    {
      question: "Which of the following lake conditions could result in the concentration of dissolved oxygen being significantly ‘under-saturated’ near the lake surface during the late summer and fall? Please select all that are true.",
      options: [
        "A high concentration of humic acids (natural ‘root beer’ color, tannins, dissolved organic carbon), which can degrade in the presence of sunlight. Oxygen is consumed in this process.",
        "As lake water begins to cool, dissolved oxygen levels drop.",
        "Recent partial or complete mixing aka: ‘turning over’ of the lake may have caused deep water with low dissolved oxygen to mix with the surface water, thereby causing the surface DO to be diluted and lowered.",
        "The lake has experienced a severe algal bloom, which has peaked and is now dying off, resulting in decomposing organisms consuming oxygen."
      ],
      correct_option: [
        "A high concentration of humic acids (natural ‘root beer’ color, tannins, dissolved organic carbon), which can degrade in the presence of sunlight. Oxygen is consumed in this process.",
        "Recent partial or complete mixing aka: ‘turning over’ of the lake may have caused deep water with low dissolved oxygen to mix with the surface water, thereby causing the surface DO to be diluted and lowered.",
        "The lake has experienced a severe algal bloom, which has peaked and is now dying off, resulting in decomposing organisms consuming oxygen."    
      ]
    },
    {
      question: "DO meters that use polarographic sensors require water to be constantly moving against the membrane when taking readings. This requires which of the following actions to be taken?",
      options: [
        "Turning the meter off and on routinely while taking a profile.",
        "Constantly moving the probe up and down several inches (aka: jigging) by raising and lowering the cable with a simple wrist movement, thus ensuring the movement of water against the membrane.",
        "Replacing the electrolyte and membrane cap each time the meter is used."
      ],
      correct_option: ["Constantly moving the probe up and down several inches (aka: jigging) by raising and lowering the cable with a simple wrist movement, thus ensuring the movement of water against the membrane."]
    },
    {
      question: "Based on the profiles displayed  in this section, how many sets of duplicate readings must be included on the field sheet? (A set in this case is a depth, a temperature measurement, and a DO measurement)",
      options: [
        "One set.",
        "Two sets.",
        "Three sets."
      ],
      correct_option: ["Three sets."],
      image: require("../assets/DIM.jpg")
    },
    {
      question: "Based on the instructions for taking duplicate readings, which of the following choice of duplicate readings and depths would be BEST for taking duplicate readings?",
      options: [
        "a. 2 meters.",
        "b. 3 and 8 meters.",
        "c. 2, 13, and 18 meters.",
        "d. 3, 7, and 15 meters.",
        "e. 0 (surface), 4 and 17 meters.",
        "Options c. & d. are equally good"
      ],
      correct_option: ["c. 2, 13, and 18 meters."], 
      image: require("../assets/DIM.jpg")
    },
    {
      question: "If, after performing a profile and then measuring your QA/QC duplicates, one of your duplicates come back 0.6 degrees Celsius colder and 0.3 mg/L higher than the original readings, what should you do?",
      options: [
        "Pack it up, that is close enough.",
        "Notate that you noticed the difference but you are all done now so no worries.",
        "Check the depth, and Try retaking the reading, potentially waiting longer for the probe to stabilize. If it still hasn’t improved, consider the possible factors that may have contributed to the discrepancy, and make a note in the comments section of the field sheet (e.g. weather change, strong wind/anchor dragged/drifted from deep hole, unstable water depth). Attempt to take an additional reading at a different more stable depth if you are able to do so.",
        "Call someone for help."
      ],
      correct_option: ["Check the depth, and Try retaking the reading, potentially waiting longer for the probe to stabilize. If it still hasn’t improved, consider the possible factors that may have contributed to the discrepancy, and make a note in the comments section of the field sheet (e.g. weather change, strong wind/anchor dragged/drifted from deep hole, unstable water depth). Attempt to take an additional reading at a different more stable depth if you are able to do so."],
      image: require("../assets/DIM.jpg")
    },
    {
      question: "Which of the temperature and DO profiles displayed above would be typical for Maine lakes shortly following ice-out in the spring?",
      options: [
        "A",
        "B",
        "C"
      ],
      correct_option: ["B"],
      image: require("../assets/DO_Profiles.png")
    },
    {
      question: "Which of the temperature and DO profiles displayed above would be typical during the late summer for a lake that is thermally stratified, and is relatively “productive”, as indicated by relatively shallow Secchi readings, and relatively high concentrations of phosphorus and chlorophyll (algal pigment)?",
      options: [
        "A",
        "B",
        "C"
      ],
      correct_option: ["C"],
      image: require("../assets/DO_Profiles.png")
    },
    {
      question: "Which of the temperature and DO profiles displayed above would be typical during the late summer for a lake that is thermally stratified, and generally has relatively deep Secchi readings,  relatively low concentrations of phosphorus and chlorophyll?",
      options: [
        "A",
        "B",
        "C"
      ],
      correct_option: ["A"],
      image: require("../assets/DO_Profiles.png")
    },
    {
      question: "Which of the following conditions in the lake could result in DO readings near the surface that are significantly “super-saturated” (greater than 100%)? Please select all that are true.",
      options: [
        "The wind is light and cool, and the lake surface very calm.",
        "Relatively rapid warming of the lake, for up to a few weeks following ice-out in the spring, which results in “out-gassing” of oxygen.",
        "A high rate of algal photosynthesis/productivity, possibly accompanied by a reduction in Secchi transparency.",
        "Encountering a “metalimnetic maxima” typically situated in the vicinity of the thermocline."
      ],
      correct_option: [
        "Relatively rapid warming of the lake, for up to a few weeks following ice-out in the spring, which results in “out-gassing” of oxygen.",
        "A high rate of algal photosynthesis/productivity, possibly accompanied by a reduction in Secchi transparency."
      ]
    }
  ];
   export default data