using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace NET.第八章
{
    class Program
    {
      public   static void Main(string[] args)
        {
          XmlDocument myXml=new XmlDocument();
          myXml.Load("books.xml");
          XmlNode book = myXml.DocumentElement;
          foreach (XmlNode node in book.ChildNodes)
          {
              //一个node代表一个节点
              string bookid = node.Attributes["ID"].Value.ToString();
              Console.WriteLine(bookid);
              Console.WriteLine("图书作者"+node["Name"].InnerText);
              Console.WriteLine("图书价格" + node["Price"].InnerText);
          }
          Console.ReadLine();
        }
    }
}
