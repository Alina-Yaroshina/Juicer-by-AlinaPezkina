import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;

import java.util.StringTokenizer;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Client implements Runnable {

    private List<MessageInfo> history = new ArrayList<MessageInfo>();
    private MessageExchange messageExchange = new MessageExchange();
    private String host;
    private Integer port;

    public Client(String host, Integer port) {
        this.host = host;
        this.port = port;
    }


    public static void main(String[] args) {
        if (args.length != 2)
            System.out.println("Usage: java ChatClient host port");
        else {
            System.out.println("Connection to server...");
            String serverHost = args[0];
            Integer serverPort = Integer.parseInt(args[1]);
            Client client = new Client(serverHost, serverPort);
            new Thread(client).start();
            System.out.println("Connected to server: " + serverHost + ":" + serverPort);
            client.listen();
        }
    }

    private HttpURLConnection getHttpURLConnection() throws IOException {
        URL url = new URL("http://" + host + ":" + port + "/chat?token=" + messageExchange.getToken(history.size()));
        return (HttpURLConnection) url.openConnection();
    }

    public List<MessageInfo> getMessages() {
        List<MessageInfo> list = new ArrayList<MessageInfo>();
        HttpURLConnection connection = null;
        try {
            connection = getHttpURLConnection();
            connection.connect();
            String response = messageExchange.inputStreamToString(connection.getInputStream());
            JSONObject jsonObject = messageExchange.getJSONObject(response);
            JSONArray jsonArray = (JSONArray) jsonObject.get("messages");
            for (Object o : jsonArray) {
                MessageInfo messageInfo = parse(o.toString());
                System.out.println(messageInfo.getUser()+": "+messageInfo.getMessageText());
                list.add(messageInfo);
            }
        } catch (IOException e) {
            System.err.println("ERROR: " + e.getMessage());
        } catch (ParseException e) {
            System.err.println("ERROR: " + e.getMessage());
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }

        return list;
    }

   private MessageInfo parse(String str) {
        String[] tokens = str.split("\"");
        return new MessageInfo(tokens[3], tokens[11], tokens[7]);
    }

   public void sendMessage(MessageInfo messageInfo) {
        HttpURLConnection connection = null;
        try {
            connection = getHttpURLConnection();
            connection.setDoOutput(true);

            connection.setRequestMethod("POST");
            DataOutputStream wr = new DataOutputStream(connection.getOutputStream());

            byte[] bytes = messageExchange.getClientSendMessageRequest(messageInfo).getBytes();
            wr.write(bytes, 0, bytes.length);
            wr.flush();
            wr.close();
            connection.getInputStream();

        } catch (IOException e) {
            System.err.println("ERROR: " + e.getMessage());
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

   public void listen() {
        while (true) {
            List<MessageInfo> list = getMessages();

            if (list.size() > 0) {
                history.addAll(list);
            }


            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.err.println("ERROR: " + e.getMessage());
            }
        }
    }

   @Override
   public void run() {
       Scanner scanner = new Scanner(System.in);
       int count = 0;
       if(history.size() == 0)
           count = 1;
       else {
           for(MessageInfo mi : history) {
               String user = mi.getUser();
               int max = Integer.parseInt(user.substring(3));
               if(max > count) {
                   count = max;
               }
           }
           count++;
       }
       String username = "User".concat(Integer.toString(count));
       while (true) {
           String text = scanner.nextLine();
           MessageInfo messageInfo = new MessageInfo(Integer.toString(history.size() + 1), username, text);
           sendMessage(messageInfo);
       }
    }
}
