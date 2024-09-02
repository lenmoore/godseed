#include <Arduino.h>

const byte ROWS = 2; 
const byte COLS = 9; 

const String hexaKeys[ROWS][COLS] = {
  {"A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09"},
  {"B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09"}
};

byte colPins[COLS] = {12, 10, 9, 8, 7, 5, 4, 3, 2}; 
byte rowPins[ROWS] = {A5, A3}; 

const int createButtonPin = A2;  // Pin for the CREATE button
const int destroyButtonPin = A0; // Pin for the DESTROY button

void setup() {
  Serial.begin(9600);
  
  for (int i = 0; i < ROWS; i++) {
    pinMode(rowPins[i], INPUT_PULLUP); // Use internal pull-up resistors
  }
  for (int i = 0; i < COLS; i++) {
    pinMode(colPins[i], INPUT);
  }
  
  pinMode(createButtonPin, INPUT_PULLUP);  // Set up the CREATE button
  pinMode(destroyButtonPin, INPUT_PULLUP); // Set up the DESTROY button
  
  Serial.println("Arduino ready");
}

void loop() {
  if (digitalRead(createButtonPin) == LOW) {
    sendKeyStates();
    delay(1000); // Debounce delay
  }

  if (digitalRead(destroyButtonPin) == LOW) {
    Serial.println("DESTROY");
    delay(1000); // Debounce delay
  }
}

void sendKeyStates() {
  Serial.print("{");
  
  for (int col = 0; col < COLS; col++) {
    pinMode(colPins[col], OUTPUT);
    digitalWrite(colPins[col], LOW); // Set current column low
    delay(1); // Small delay to allow state change to propagate

    for (int row = 0; row < ROWS; row++) {
      bool keyPressed = !digitalRead(rowPins[row]); // Button pressed if LOW
      Serial.print("\"");
      Serial.print(hexaKeys[row][col]);
      Serial.print("\": ");
      Serial.print(keyPressed ? "true" : "false");
      
      if (col < COLS - 1 || row < ROWS - 1) {
        Serial.print(", ");
      }
    }

    pinMode(colPins[col], INPUT);
    delay(1); // Small delay to stabilize
  }

  Serial.println("}");
}
