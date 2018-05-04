using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace lianxi
{
   public  class Parent
    {

        public virtual void Run()
        {
            Console.WriteLine("交通工具正在行驶！");

        }
       //回家的方法 父类作为参数
       public void Gohome(Parent P)
       {
          P.Run();
       }
    }
}
