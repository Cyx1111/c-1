﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JIShuangQi
{
    public class OperationAdd : Operation
    {
        public override double GetResult()
        {
            double result = NumberA + NumberB;
            return result;
        }
    }
}
