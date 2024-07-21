#### Features implemented

V0.14 21JUL2024

- We have a basic App working
- chat assistant for running related questions
- login with google
- stores user data with veriified email
- stores chat history per user
- login with email
- stores user data but unverified email
- client allows copying prompt, response
- client display token usage

#### Features to be implemented

- prework for memory for chat assistant

  - assess what is needed to store chat history
    - KV store
  - convert /coach from GET to POST request
  - make related changes to /score too
  - assess what is needed to store chat history
    - get intent and entity to analyse questions
    - store personal context in memory too.
    - could we store personal context in session - or both persistently and in session
  - what should be the memory context length
  - keep track of tokens to ensure we don't exceed the context limit for model

- memory for chat assistant
- start new conversation
- Ensure status has features too
- client to indicate some token usage, #of questions/conversations
- client to give feedback thumbs up/down

✅✅✅✅✅✅✅✅✅✅

- Cosmetic:
  - ✅adjust login screen - too much gap on top
  - ✅repair login route - somewhere /login is returning to /glogin
  - enclose login in a rounded rectangle
