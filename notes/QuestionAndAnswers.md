# Question/Answer Parameter and Entity Name #

### PSoC ###
1.
  a. - anyLossOfConsciousnessYes
     - anyLossOfConsciousnessDuration

  b. - anyLossOfConsciousnessNo

2.
  a. - lossOfMemoryYes
     - lossOfMemoryDuration
     - lossOfMemoryConclusion

  b. - lossOfMemoryNo

3.
  a. - facialInjuryYes

  b. - facialInjuryNo

No Answers Entity = User-Answers-No
Yes Answers Entity = User-Answers-Yes


### HYDF ###

##### Initialize => beginHYDF #####

1. headache
2. pressureInHead
3. neckPain
4. nauseaOrVomiting
5. dizziness
6. balanceProblems
7. blurredVision
8. sensitivityToLight
9. sensitivityToNoise
10. feelingSlowedDown
11. feelingLikeInAFog
12. dontFeelRight
13. difficultyConcentrating
14. difficultyRemembering
15. fatigueOrLowEnergy
16. confusion
17. drowsiness
18. troubleFallingAsleep
19. moreEmotional
20. irritability
21. sadness
22. nervousOrAnxious
23. symptomsWorseMental
24. symptomsWorsePhysical

1 - 22 Entity = HYDF
23 Entity = User-Symptoms-Worse-Mental
24 Entity = User-Symptoms-Worse-Physical


### SAC Orientation ###

1. checkMonth
2. checkDate
3. checkDayOfWeek
4. checkYear
5. checkTime

1 Entity = checkMonth
2 Entity = checkDate
3 Entity = sys.date or checkDayOfWeek
4 Entity = sys.date-period


### SAC Immediate Memory ###

1. memoryRecallTrial1
2. memoryRecallTrial2
3. memoryRecallTrial3

Entity = MemoryRecall


### SAC Concentration ###

1. digitsQ1
2. digitsQ2
3. digitsQ3
4. digitsQ4
5. monthsBackwards
6. delayedRecall

1 - 3 Entity = sys.number
4 Entity = monthsBackwards
5 Entity = MemoryRecall


### Test Conclusion ###

1.
  a. userEmailOptOut
  b. userEmailOptIn
