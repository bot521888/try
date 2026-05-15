import random

name = input("你好，请告诉我你的名字：")
print(f"你好，{name}！很高兴见到你。")

jokes = [
    "为什么程序员都喜欢黑色？因为他们不喜欢bug！",
    "有一天，代码走进了一家酒吧，然后崩溃了。",
    "什么动物最喜欢写代码？答：Python！",
    "为什么计算机很擅长唱歌？因为它有很多的字节（beats）！",
    "有一只小猫学编程，它会什么？喵（妙）代码！"
]

print("这里有一个关于编程的笑话给你：")
print(random.choice(jokes))