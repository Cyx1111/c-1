using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace three
{
 public class jiexi
    {
        Dictionary<string,Move> items = new Dictionary<string, Move>();

        public void LoadItem()
        {
            //XmlDocument doc = new XmlDocument();
            //doc.Load("Address.xml");
            //XmlNode node =new XmlDocument();
            //foreach (XmlNode item in node.ChildNodes)
            //{
            //    Move move = new Move();
            //    move.Jv = item["juwei name"].InnerText;
            //    move.Lou = item["jianzhu smid"].InnerText;
            //    move.Fang = item["fjname"].InnerText;
            //    move.Fang2 = item["fjname"].InnerText;
            //    items.Add(move.Jv,move);
          
                XmlDocument xml = new XmlDocument();  
//xml.Load("Address.xml"); //获取xml文件路径  
//XmlNode node1 = xml.DocumentElement; //获取xml文件根节点  
//string name1 = node1.Attributes["name"].Value;//获取该节点的值  
//TreeNode node2 = new TreeNode(name1);  
//treeView1.Nodes.Add(node2);//获取树节点集合  
////获取节点的所有子节点  
//foreach (XmlNode  item in node1.ChildNodes )  
//{  
//    string name2=item .Attributes["name"].Value;  
//    TreeNode node3 = new TreeNode(name2);  
//    node2.Nodes.Add(node3);  
  
   
            }
        }
        
       


    }
}
