using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace 影院售票系统
{
    class Schedule//放映计划类
    {
        private Dictionary<string, Scheduleltem> items = new Dictionary<string, Scheduleltem>();

        internal Dictionary<string, Scheduleltem> Items
        {
            get { return items; }
            set { items = value; }

        }
        public void LoadItems()//解析xml
        {
            XmlDocument doc=new XmlDocument();      
            doc.Load("ShowList.xml");
            XmlNode node = doc.DocumentElement;
            foreach (XmlNode item in node.ChildNodes)
            {
                Movie movie = new Movie();
                //一个item就代表一个movie
                movie.MovieName = item["Name"].InnerText;
                movie.Poster = item["Poster"].InnerText;
                movie.Director = item["Director"].InnerText;
                movie.Actor = item["Actor"].InnerText;
                movie.Price = Convert.ToInt32(item["Price"].InnerText);
                movie.MovieType = (MovieType) Enum.Parse(typeof (MovieType), item["Type"].InnerText);
                foreach (XmlNode schedule in item["Schedule"].ChildNodes)
                {
                    Scheduleltem sitem = new Scheduleltem();
                    sitem.Time = schedule.InnerText;
                    sitem.Movie = movie;
                    items.Add(sitem.Time,sitem);

                }
            }

        }
    }
}
