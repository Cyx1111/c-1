using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace lianxi
{
    class Program
    {
        static void Main(string[] args)
        {
            Parent P=new Parent();
            P.Gohome(new Car());
            //虽然引用的父类，但是后来还是根据n子类出现想要的
            //父类是虚方法，而子类是重写，先进入父类的方法，然后跳到new的子类，最后进入父方法
            //厘式原则，子类可以继承父类
            Console.ReadLine();
        }
    }
}
