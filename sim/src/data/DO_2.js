const data = [
    {
      question: "Which of the following is the OPTIMAL method for determining whether or not you are at the correct depth for your selected monitoring station?",
      options: [
        "Lower the probe/sensor into the water until the tension on the cable becomes limp, and measure the depth.",
        "Use shoreline/watershed reference points to triangulate the approximate location – or – enter the station location coordinates provided by LSM into a GPS receiver to guide you to the location. In either case, confirm the station location with a depth finder.",
        "Lower the anchor until it reaches the bottom, and measure the length of the anchor line."
      ],
      correct_option: ["Use shoreline/watershed reference points to triangulate the approximate location – or – enter the station location coordinates provided by LSM into a GPS receiver to guide you to the location. In either case, confirm the station location with a depth finder."]
    },
    {
      question: "What is the theoretical relationship between water temperature and the solubility of dissolved oxygen?",
      options: [
        "As water temperature increases, dissolved oxygen also increases.",
        "As water depth increases, dissolved oxygen is lower.",
        "The relationship is inverse: cold water is able to 'hold' more dissolved oxygen than warm water. In other words, as water temperature drops, dissolved oxygen increases, providing all other factors are held constant.",
        "As water temperature drops, so does the concentration of oxygen.",
        "Oxygen at the surface is always higher than below."
      ],
      correct_option: ["The relationship is inverse: cold water is able to 'hold' more dissolved oxygen than warm water. In other words, as water temperature drops, dissolved oxygen increases, providing all other factors are held constant."]
    },
    {
      question: "Why would you expect to see similar temperature and DO readings throughout the water column in the spring and autumn?",
      options: [
        "The lake is thermally stratified.",
        "The lake has recently mixed (turned over), following ice out in the spring, or cooler weather and strong winds in late summer/autumn.",
        "The lake is mixing but is still thermally stratified.",
        "The lake is mixing, because the cold water is now sitting on top."
      ],
      correct_option: ["The lake has recently mixed (turned over), following ice out in the spring, or cooler weather and strong winds in late summer/autumn."]
    },
    {
      question: "Which of the following conditions in the lake could result in DO readings near the surface that are significantly 'super-saturated' (greater than 100%)? Please select all that are true.",
      options: [
        "Relatively rapid warming of the lake, for up to a few weeks following ice-out in the spring, which results in 'out-gassing' of oxygen.",
        "A high rate of algal photosynthesis/productivity, possibly accompanied by a reduction in Secchi transparency.",
        "People swimming in the water."
      ],
      correct_option: [
        "Relatively rapid warming of the lake, for up to a few weeks following ice-out in the spring, which results in 'out-gassing' of oxygen.",
        "A high rate of algal photosynthesis/productivity, possibly accompanied by a reduction in Secchi transparency."
      ]
    },
    {
      question: "If you saw the DO concentration dip dramatically several meters down in the water column, then several meters beyond that recover some, what could this be? What should you do?",
      options: [
        "It is definitely an error with your meter. You will need to contact LSM and probably get a new sensor or cable or meter or all three.",
        "It could be a 'metalimnetic minima'. Record the values and, try resampling that region (you only need to record once) to ensure the values are correct.",
        "It is the thermocline. The water is holding less oxygen because it is getting colder. It is fine to record the values."
      ],
      correct_option: ["It could be a 'metalimnetic minima'. Record the values and, try resampling that region (you only need to record once) to ensure the values are correct."]
    },
    {
      question: "Do thermoclines exist all summer on all Maine lakes and ponds in a typical year?",
      options: [
        "All Maine lakes and ponds in a typical year have a thermocline all summer long.",
        "All Maine lakes and ponds in a typical year have a thermocline all summer long, except at night during a typical year.",
        "All Maine lakes and ponds in a typical year have a thermocline in summer, but this can be disrupted by strong wind. This is especially true for shallow ponds.",
        "Many Maine lakes and ponds in a typical year have a thermocline in summer, but this can be disrupted by strong wind. This is especially true for shallow ponds, and if a pond is very shallow, it may not develop a thermocline due to consistent mixing and the entire water column being heated.",
        "All Maine lakes and ponds in a typical year do not develop a thermocline, that is a wintertime phenomenon."
      ],
      correct_option: ["Many Maine lakes and ponds in a typical year have a thermocline in summer, but this can be disrupted by strong wind. This is especially true for shallow ponds, and if a pond is very shallow, it may not develop a thermocline due to consistent mixing and the entire water column being heated."]
    }
  ];

  export default data
  