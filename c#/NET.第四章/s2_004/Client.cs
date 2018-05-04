using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace s2_004
{//顾客类
    class Client
    {
        public void Order(waittress w ,Order o) {
            Console.WriteLine("顾客开始点餐：{0}！",o.meallist);
            w.GetOrder(o);
        }

        //用餐
        public void eat(){
        Console.WriteLine("客人用餐");
        }
      
        }
    }

