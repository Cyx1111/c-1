using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace s2_004
{
    class Program
    {
        static void Main(string[] args)
        {
            Client wang = new Client();
            waittress w = new waittress();
            waittress zhang = new waittress();
            chef ch = new chef();
            //初始化菜单
            Order o=new Order();
            //设置订了该菜单的顾客
            o.customer = wang;
            o.id = 100;
            o.meallist = "水煮鱼";
            //顾客wang选中waitress服务给自己服务
            wang.Order(w ,o);
            //服务员将菜单信息告知厨师chef
            w.SendOrder(ch);
            //w.transcook();
            //wang.eat();

            //厨师根据菜单做菜
            ch.cook();
            ch.SendAlert(w);
            w.transcook();
          
            Console.Read();

        }
    }
}
