const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const notion_client = require('@notionhq/client').Client;
const notion_key = process.env.NOTION_KEY;
const db_id = process.env.NOTION_DATABASE;
const notion = new notion_client({ auth: notion_key });
const BOT_TOKEN = process.env.BOT_TOKEN;

/*
Handling updates received from telegram's webhook
Presently,
1. Messages corresponding to new channels are added to a newly created page corresponding to the chat
2. Messages corresponding to old channels are added to their respective notion pages
3. Updated messages are repeated in notion with the same time-stamp (since notion does not allow deletion/updating already created blocks)
4. Photos shared in channels can be accessed by their url in the notion doc. The procedure is same for other files, just the field names in
the telegram updates need to be updated.
*/
module.exports.process_message = async (message) => {
    if (message["edited_channel_post"]) {
        message["channel_post"] = message["edited_channel_post"]
    }
    const chat_id = message["channel_post"]["chat"]["id"];
    console.log(chat_id);
    console.log(read_chat_id(chat_id));
    if (read_chat_id(chat_id) === "") {
        console.log("Entering");
        const page_id = await create_notion_page(message["channel_post"]["chat"]["title"])
        fs.writeFileSync("data.txt", chat_id+":" + page_id + '\n', (err) => {
            if (err)
                console.log(err);
        });
    }
    const page_id = await read_chat_id(chat_id);
    console.log(page_id);
    var text = message["channel_post"]["text"];
    if (message["channel_post"]["photo"]) {
        console.log(message["channel_post"]["photo"])
        const data = await axios.post("https://api.telegram.org/bot" + BOT_TOKEN + "/getFile", {
            file_id: (message["channel_post"]["photo"]).pop()["file_id"]
        });
        console.log(data.data);
        const caption = message["channel_post"]["caption"]||""
        text=caption+"\nhttps://api.telegram.org/file/bot"+BOT_TOKEN+"/"+data["data"]["result"]["file_path"]
    }
    await add_block_to_page({
        "timestamp": new Date(message["channel_post"]["date"] * 1000).toLocaleString(),
        "text": text
    }, page_id);

}

// Creating a new notion page corresponding to a chat
async function create_notion_page(title) {
    try {
        const data = await notion.pages.create({
            parent: {
                database_id: db_id,
            },
            properties: {
                title: {
                    title: [{
                        "text": {
                            "content": title
                        }
                    }]
                }
            }
        });
        console.log(data);
        return data["id"];
    }
    catch (err) {
        console.log(err);
    }
}

// Adding a new message to a Notion page
async function add_block_to_page(content, page_id) {
    try{
    const res = await notion.blocks.children.append({
        block_id: page_id,
        children: [{
            object: "block",
            type: "paragraph",
            paragraph: {
                text: [{
                    type: 'text',
                    text: {
                        content:"("+content["timestamp"]+"): "+content["text"]
                    }
                }]
            }
        }]
    });
    console.log(res);
}
catch (err) {
    console.log(err);
}
}

// Read the id of the notion page corresponding to the current chat
function read_chat_id(chat_id) {
    var data = fs.readFileSync("data.txt");
    data = data.toString();
    data = data.split("\n");
    for (item of data) {
        if (item.split(':')[0] === chat_id.toString())
            return item.split(':')[1]
    }
    return "";
}