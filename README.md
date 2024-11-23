# Ranking Bot for Discord
## Overview
I have devoloped this discord bot specifically for mountains ranking in Gorilla Tag, however you can use this bot for any type of leaderboard ranking you want. This 100% discord.js bot has many different features and commands like a leaderboard that displays inside a discord channel, rank history, command to update ranks, and many other easy to use features.
## Commands
### /update-ranks
- This command allows users with the "Ranker" role or higher to update the leaderboard.
- How it works:
    1. The ranker runs the command /update-ranks and is shown 3 different options for up to 8 people
        - User
        - Rank
        - Position
    2. The ranker will then fill in the necessary information for each user they wish to add/update the ranks with. Minimum of 1 user
    3. The User option is what user the ranker is updating (up to 8 people)
    4. The Rank option is what rank that user will be getting (choose the current rank if only their position is changing)
    5. The Position option is what position they will be moved to inside the leaderboard (starting from the top of each rank counting down)
    6. Repeat for however many users you want to add and it will update the leaderboard message, send logs, and send update messages accordingly for new/updated/removed users.
### /event-reminder-start
- This command allows users with the "Ranker" role or higher to start automatic event reminders
- How it works:
    1. The user will run the command /event-reminder-start to start reminders throughout the week
        - Monday:
            - 3:15 PM EST
            - 5:45 PM EST
            - 8:15 PM EST
        - Wednesday:
            - 3:15 PM EST
            - 5:45 PM EST
            - 8:15 PM EST
        - Friday:
            - 3:15 PM EST
            - 5:45 PM EST
            - 8:15 PM EST
    2. If the bot does not crash at all then the events will always run
    3. If and error or crash happens then run the command again or run /event-reminder-stop
    4. It will send the task at each time interval and ask the user 2 options:
        - "Give My Availability"
            - Used to say if the user **can** or **cannot** do the event
        - "Check My Availability"
            - Used to show what your availability is if you have forgetten at the top
            - Will also give options to change your availabilty or check the availability of other rankers\
        Note: Users have 45 minutes to answer and at the start of each task 1 hour 45 minutes until event.
    5. Whether someone said they can, cannot, or no answer an announcement message will be sent notifying the status
    6. If yes, "Event in 1 hour". If no or no response, "Event cancelled. No rankers available". 
### /event-reminder-stop
- This command allows users with the "Ranker" role or higher to stop automatic event reminders
- How it works:
    1. If something is wrong with the event reminders or you want to restart them
        - Run the command /event-reminder-stop and it will stop them
### /event-code
- This command allows users with the "Ranker" role or higher to post the event code to the event announcement channels and early access channels
- How it works:
    1. At the time of the event you are doing you run the command /event-code
    2. There will be 3 options you get
        - Code: (required)
            - The code for the event in GTAG (max of 10 characters)
        - type-of-event (optional)
            - Type in the type of event there will. For example, "Normal event" or "Mini games event"
        - send-code-immediately (optional)
            - Option to send the code on run of the command directly to normal announcements with no early access
    3. If you don't send the code immediately it will send the code first to early access
    4. At the same time a 3 minute count down will start before it sends the code to the event announcements
    5. If you want to send the code at any point during that time go to the rankers channel and click the button that has appeared. It will say "Send the code right now"
        - If you click this button it will stop the timer and send the code directly to the announcements channel
### /event-status
- This command can be used by everyone to see the status of the next event
- How it works:
    1. At the start of the event reminders task the status will be reset in the database, with no rankers available and the event status as look back later
    2. Once a ranker has either said yes or no to an event it will update the status
        - If yes, it will say there is an event happening and which rankers will be hosting
        - If no, it will say the next event is not happening and which rankers said no
### /what-rank-is
- This command can be used by everyone to see what rank and rank history someone has
- How it works:
    1. A user can run the command /what-rank-is and input the user they want to look at
    2. After entering that they will see 2 different pages
        - First page:
            - Says what rank they currently are (unranked-diamond) at the top
            - The history of their rank changes (moving between the different ranks) and when that happened
        - Second page:
            - Says what rank they currently are (unranked-diamond) at the top
            - The history of their position changes (moving within the rank they are) and when that happened
### /recent-rank-changes
- This command can be used by everyone to see the recent changes to the ranks
- How it works:
    1. A user can run the command /recent-rank-changes to see the history of the last 10 rank changes
    2. This shows both rank and position changes as well as the time and day it happened
    3. It will show it on 2 pages
### /leaderboard
- This command allows users with the "BOD" role or higher to send the full leaderboard into the chat
- How it works:
    1. When you run the command /leaderboard it will display the full ranks for everyone based off the database
    2. If there is a large amount of players ranked then it will split the messages up
    3. When the ranker runs the command /update-ranks this leaderboard message will be automatically updated
### /possible-ranks
- This command can be used by everyone to see what ranks are possible to get
- How it works:
    1. When a user runs the command /possible-ranks a list of every possible rank will show up
        - Unranked, Copper, Iron, Silver, Gold, Platinum, and Diamond
    2. Fun fact:
        - This was the first command I made because of how easy it was. It helped me learn a little more about discord.js bot command development and pathed the way to the rest of the commands above