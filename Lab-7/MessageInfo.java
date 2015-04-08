import org.json.simple.JSONObject;
import java.io.*;
import java.lang.Override;

public class MessageInfo {
    private String user;
    private String message;
    private String id;

    public MessageInfo(String id, String user, String message) {
        this.id = id;
        this.user = user;
        this.message = message;
    }

    public String getUser() {
        return user;
    }

    public String getMessageText() {
        return message;
    }

    public String getID() {
        return id;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", id);
        jsonObject.put("user", user);
        jsonObject.put("message", message);
        return jsonObject.toJSONString();
    }
}