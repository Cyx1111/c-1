using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace 网络精灵电视台
{
    //A类频道
    public class TypeAChannel : ChannelBase
    {

        public override void Fetch()
        {
            XmlDocument xml = new XmlDocument();
            xml.Load("北京电视台.xml");
            XmlNode root = xml.DocumentElement;
            if (Tvlist == null)
            {
                Tvlist = new List<TvProgram>();
            }
            //Tvlist = new List<TvProgram>();
            foreach (XmlNode node in xml.ChildNodes)
            {
                if (node.Name=="tvProgramTable")
                {
                    foreach (XmlNode item in node.ChildNodes)
                    {
                        TvProgram program = new TvProgram();
                        program.Playtime = DateTime.Parse(item["playTime"].InnerText);
                        program.Path = item["path"].InnerText;
                        program.Shiduan = item["meridien"].InnerText;
                        program.Name = item["programName"].InnerText;
                        Tvlist.Add(program);
                    }
                }

            }



        }
    }
}

