using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace 网络精灵电视台
{
    //频道管理类
    public class ChannelManager
    {
        //定义一个泛型集合,所有电台
       
       
        public Dictionary<string, ChannelBase> dic = new Dictionary<string, ChannelBase>();
        public static ChannelBase CreateChannel(string type)
        {
            ChannelBase channel = null;
            switch (type)
            {
                case "TypeA":
                    channel = new TypeAChannel();
                    break;
                case "TypeB":
                    channel = new TypeAChannel();
                    break;
                default:
                    break;


            }
            return channel;

        }


        public void LoadAllChannel()
        {
            XmlDocument doc = new XmlDocument();
            doc.Load("FullChannels.xml");
            XmlNode node = doc.DocumentElement;
           
            foreach (XmlNode item  in  node.ChildNodes)
            {

                ChannelBase cb = CreateChannel(item["channelType"].InnerText);
                //根据创建不同子类的对象将不同频道名称赋值给属性
                cb.Channelname = item["tvChannel"].InnerText;
                cb.Path = item["path"].InnerText;
                //根据不同子类对象执行重写方法 给 节目列表赋值
                cb.Fetch();
                //将不同频道 赋值给所有频道泛型集合
                dic.Add(cb.Channelname, cb);
            }
        }
    }
}