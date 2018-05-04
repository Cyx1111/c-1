using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace 网络精灵电视台
{
  public  class TypeBChannel:ChannelBase
    {
      //B类
      public override void Fetch()
      {
          XmlDocument doc=new XmlDocument();
          doc.Load("凤凰卫视");
          XmlNode node=new XmlDocument();
          if (Tvlist == null)
          {
              Tvlist = new List<TvProgram>();
          }
          foreach (XmlNode item in node["ProgramList"].ChildNodes)
          {
              string name = item["Name"].InnerText;
              string platytime = item["playTime"].InnerText;
              string path = item["Path"].InnerText;

              TvProgram tv = new TvProgram();
              //把值用xml拿到最后给节目类
              tv.Name = name;
              tv.Path = path;
              tv.Playtime = Convert.ToDateTime(platytime);

              this.Tvlist.Add(tv);


          }

      }
    }
}
