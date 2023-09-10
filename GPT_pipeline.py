import json
import os
import numpy as np
import openai

class ChatApp:
    def __init__(self):
        # Setting the API key to use the OpenAI API
        openai.api_key = "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"
        self.messages = [
            {"role": "system", "content": "food shit."},
        ]

    def chat(self, message):
        self.messages.append({"role": "user", "content": message})
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=self.messages,
            temperature=0
        )
        self.messages.append({"role": "assistant", "content": response["choices"][0]["message"].content})
        return response["choices"][0]["message"]["content"]

def get_data(chats):
  chat = ChatApp()
  ms1 = chat.chat(chats[0])
  ms2 = chat.chat(chats[1])
  ms3 = chat.chat(chats[2])
  ms4 = chat.chat(chats[3])
  ms5 = chat.chat("Make sure there are no comments")
  curl = ms5.find("{")
  final=ms5[curl:ms5.find("`",curl)]
  try:
    res = eval(final)
  except:
    pass
  print(res)
  return res

def get_description(meal):
   chat = ChatApp()
   return chat.chat("give me a 30 word description of "+meal)
