using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;
using System.Windows.Forms;

namespace Day08网络电视精灵
{
    /**
     * 负责解析名称 为FullChannels.xml 
     */
    public class ChannelManager
    {
        //定制一个泛型集合  List<T> Dictionary<K,V>
        //key:频道的名称    value:频道对象
        private Dictionary<string, ChannelBase> allChannels = new Dictionary<string, ChannelBase>();

        public Dictionary<string, ChannelBase> AllChannels
        {
            get { return allChannels; }
            set { allChannels = value; }
        }
        /// <summary>
        /// 解析所有电视台，并且填充到泛型集合
        /// </summary>
        public void ResolveAllChannels() 
        {
            XmlDocument doc = new XmlDocument();
            doc.Load("files/FullChannels.xml");
            //Resharper
            XmlNode root=doc.DocumentElement;
            foreach (XmlNode item in root.ChildNodes)
            {
               string type= item["channelType"].InnerText;
                //一个item就是一个频道
               ChannelBase channel = ChannelFactory.getInstance(type);
               channel.ChannelName = item["tvChannel"].InnerText;
               channel.Path = item["path"].InnerText;

               allChannels.Add(channel.ChannelName, channel);

            }
            
        }
      
    }

}
