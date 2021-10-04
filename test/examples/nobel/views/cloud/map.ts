import "../../../../../src/builtins/map";
import { Prize, PrizeAwarded } from "../../types";

function mapMotivationTerms(prize: Prize) {
  const { overallMotivation } = prize;
  if (overallMotivation) {
    for (const word of overallMotivation.split(" ")) {
      emit(word);
    }
  }

  const { laureates } = prize as PrizeAwarded;
  if (laureates) {
    let lastMotivation;
    for (const laureate of laureates) {
      const { motivation } = laureate;
      // skip duplicate motivations
      if (motivation !== lastMotivation) {
        for (const word of motivation.split(" ")) {
          emit(word);
        }
      }
    }
  }
}

mapMotivationTerms;
