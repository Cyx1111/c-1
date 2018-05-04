// 此示例将引导您了解 F# 语言的各个元素。
//
// *******************************************************************************************************
//   若要在 F# Interactive 中执行代码，请突出显示一个代码节并按 Alt-Enter 或右击
//   并选择“在 Interactive 中执行”。可从“视图”菜单中打开 F# Interactive 窗口。
// *******************************************************************************************************
//
// 有关 F# 的详细信息，请参见:
//     http://fsharp.net
//
// 有关要用于 F# 的其他模板，请参见 Visual Studio 中的“联机模板”。
//     “新建项目”-->“联机模板”
//
// 有关特定的 F# 主题，请参见:
//     http://go.microsoft.com/fwlink/?LinkID=234174 (F# 开发门户)
//     http://go.microsoft.com/fwlink/?LinkID=124614 (代码库)
//     http://go.microsoft.com/fwlink/?LinkId=235173 (数学/统计编程)
//     http://go.microsoft.com/fwlink/?LinkId=235176 (图表)

// 内容:
//    - 整数和基本函数
//    - 布尔值
//    - 字符串
//    - 元组
//    - 列表和列表处理
//    - 类
//    - 泛型类
//    - 实现接口
//    - 数组
//    - 序列
//    - 递归函数
//    - 记录类型
//    - 联合类型
//    - 选项类型            
//    - 模式匹配        
//    - 度量单位        
//    - 平行数组编程
//    - 使用事件
//    - 使用类型提供程序的数据库访问
//    - 使用类型提供程序的 OData 访问



// ---------------------------------------------------------------
//         整数和基本函数
// ---------------------------------------------------------------

module Integers = 
    let sampleInteger = 176

    /// 执行某个以第一个整数开头的算法
    let sampleInteger2 = (sampleInteger/4 + 5 - 7) * 4

    /// 从 0 到 99 的数字列表
    let sampleNumbers = [ 0 .. 99 ]

    /// 包含从 0 到 99 的所有数字及其平方的所有元组的列表
    let sampleTableOfSquares = [ for i in 0 .. 99 -> (i, i*i) ]

    // 下一行对一般输出使用 %A 来输出包含元组的列表
    printfn "The table of squares from 0 to 99 is:\n%A" sampleTableOfSquares


module BasicFunctions = 

    // 使用“let”可定义接受整数参数并返回整数的函数。
    let func1 x = x*x + 3             

    // 括号对函数参数是可选的
    let func1a (x) = x*x + 3             

    /// 应用函数，并使用“let”命名函数返回结果。
    /// 变量类型是从函数返回类型推导出来的。
    let result1 = func1 4573
    printfn "The result of squaring the integer 4573 and adding 3 is %d" result1

    // 需要时，请使用“(argument:type)”批注参数名称的类型
    let func2 (x:int) = 2*x*x - x/5 + 3

    let result2 = func2 (7 + 4)
    printfn "The result of applying the 1st sample function to (7 + 4) is %d" result2

    let func3 x = 
        if x < 100.0 then 
            2.0*x*x - x/5.0 + 3.0
        else 
            2.0*x*x + x/5.0 - 37.0

    let result3 = func3 (6.5 + 4.5)
    printfn "The result of applying the 2nd sample function to (6.5 + 4.5) is %f" result3



// ---------------------------------------------------------------
//         布尔值
// ---------------------------------------------------------------

module SomeBooleanValues = 

    let boolean1 = true
    let boolean2 = false

    let boolean3 = not boolean1 && (boolean2 || false)

    printfn "The expression 'not boolean1 && (boolean2 || false)' is %A" boolean3



// ---------------------------------------------------------------
//         字符串
// ---------------------------------------------------------------

module StringManipulation = 

    let string1 = "Hello"
    let string2  = "world"

    /// 使用 @ 可创建原义字符串
    let string3 = @"c:\Program Files\"

    /// 使用三重引号字符串
    let string4 = """He said "hello world" after you did"""

    let helloWorld = string1 + " " + string2 // 通过在两个字符串之间插入空格来连接它们
    printfn "%s" helloWorld

    /// 通过采用某个结果字符串中的前 7 个字符形成的字符串
    let substring = helloWorld.[0..6]
    printfn "%s" substring



// ---------------------------------------------------------------
//         元组(已排序的值组)
// ---------------------------------------------------------------

module Tuples = 

    /// 一个包含整数的简单元组
    let tuple1 = (1, 2, 3)

    /// 一个用于交换两个值在元组中的顺序的函数。
    /// QuickInfo 显示该函数被推断为具有泛型类型。
    let swapElems (a, b) = (b, a)

    printfn "The result of swapping (1, 2) is %A" (swapElems (1,2))

    /// 一个元组，包含一个整数、一个字符串和一个双精度浮点数
    let tuple2 = (1, "fred", 3.1415)

    printfn "tuple1: %A    tuple2: %A" tuple1 tuple2
    


// ---------------------------------------------------------------
//         列表和列表处理
// ---------------------------------------------------------------

module Lists = 

    let list1 = [ ]            /// 一个空列表

    let list2 = [ 1; 2; 3 ]    /// 包含 3 个元素的列表

    let list3 = 42 :: list2    /// 在开头添加了“42”的列表

    let numberList = [ 1 .. 1000 ]  /// 包含 1 和 1000 之间的整数的列表

    /// 一个包含一年中的所有日的列表
    let daysList = 
        [ for month in 1 .. 12 do
              for day in 1 .. System.DateTime.DaysInMonth(2012, month) do 
                  yield System.DateTime(2012, month, day) ]

    /// 一个包含元组的列表，其中的元组是棋盘上的黑色方块的坐标。
    let blackSquares = 
        [ for i in 0 .. 7 do
              for j in 0 .. 7 do 
                  if (i+j) % 2 = 1 then 
                      yield (i, j) ]

    /// 求 numberList 中的数字的平方，并使用管道运算符向 List.map  传递参数
    let squares = 
        numberList 
        |> List.map (fun x -> x*x) 

    /// 计算可被 3 除的数字的平方的总和。
    let sumOfSquaresUpTo n = 
        numberList
        |> List.filter (fun x -> x % 3 = 0)
        |> List.sumBy (fun x -> x * x)



// ---------------------------------------------------------------
//        类
// ---------------------------------------------------------------

module DefiningClasses = 

    /// 该类的构造函数采用了两个参数: dx 和 dy (这两个参数均为“float”类型)。
    type Vector2D(dx : float, dy : float) = 
        /// 构造对象时计算的矢量的长度
        let length = sqrt (dx*dx + dy*dy)

        // “this”用于指定对象的自我标识符的名称。
        // 在实例方法中，它必须出现在成员名称之前。
        member this.DX = dx  

        member this.DY = dy

        member this.Length = length

        member this.Scale(k) = Vector2D(k * this.DX, k * this.DY)
    
    /// 一个 Vector2D 类的实例
    let vector1 = Vector2D(3.0, 4.0)

    /// 获取新的缩放矢量对象而不修改原始对象
    let vector2 = vector1.Scale(10.0)

    printfn "Length of vector1: %f      Length of vector2: %f" vector1.Length vector2.Length



// ---------------------------------------------------------------
//         泛型类
// ---------------------------------------------------------------

module DefiningGenericClasses = 

    type StateTracker<'T>(initialElement: 'T) = // 'T 是类的类型参数

        /// 在数组中存储状态
        let mutable states = [ initialElement ]

        /// 将新元素添加到状态列表中
        member this.UpdateState newState = 
            states <- newState :: states  // 使用“<-”运算符转变值

        /// 获取历史状态的完整列表
        member this.History = states

        /// 获取最新状态
        member this.Current = states.Head

    /// 状态跟踪程序类的一个“int”实例。请注意，已推断类型参数。
    let tracker = StateTracker 10

    // 添加状态
    tracker.UpdateState 17



// ---------------------------------------------------------------
//         实现接口
// ---------------------------------------------------------------

/// 用于实现 IDisposable 的类型
type ReadFile() =

    let file = new System.IO.StreamReader("readme.txt")

    member this.ReadLine() = file.ReadLine()

    // 此类的 IDisposable 成员的实现
    interface System.IDisposable with    
        member this.Dispose() = file.Close()



// ---------------------------------------------------------------
//         数组
// ---------------------------------------------------------------

module Arrays = 

    /// 空数组
    let array1 = [| |]

    let array2 = [| "hello"; "world"; "and"; "hello"; "world"; "again" |]

    let array3 = [| 1 .. 1000 |]

    /// 一个仅包含单词“hello”和“world”的数组
    let array4 = [| for word in array2 do
                        if word.Contains("l") then 
                            yield word |]

    /// 一个由索引初始化且包含 0 和 2000 之间的偶数的数组
    let evenNumbers = Array.init 1001 (fun n -> n * 2) 

    /// 使用切片表示法提取的子数组
    let evenNumbersSlice = evenNumbers.[0..500]

    for word in array4 do 
        printfn "word: %s" word

    // 使用左箭头赋值运算符修改数组元素
    array2.[1] <- "WORLD!"

    /// 计算以“h”开头的单词的长度的总和
    let sumOfLengthsOfWords = 
        array2
        |> Array.filter (fun x -> x.StartsWith "h")
        |> Array.sumBy (fun x -> x.Length)



// ---------------------------------------------------------------
//         序列
// ---------------------------------------------------------------

module Sequences = 
    // 将根据需要计算序列，并在每次循环访问它们时重新进行计算。
    // F# 序列是 System.Collections.Generic.IEnumerable<'T> 的实例，
    // 因此，Seq 函数也可应用于列表和数组。

    /// 空序列
    let seq1 = Seq.empty

    let seq2 = seq { yield "hello"; yield "world"; yield "and"; yield "hello"; yield "world"; yield "again" }

    let numbersSeq = seq { 1 .. 1000 }

    /// 另一个仅包含单词“hello”和“world”的数组
    let seq3 = 
        seq { for word in seq2 do
                  if word.Contains("l") then 
                      yield word }

    let evenNumbers = Seq.init 1001 (fun n -> n * 2) 

    let rnd = System.Random()

    /// 一个可随机访问的无限序列
    //  使用 yield! 返回子序列的每个元素，类似于 IEnumerable.SelectMany。
    let rec randomWalk x =
        seq { yield x
              yield! randomWalk (x + rnd.NextDouble() - 0.5) }

    let first100ValuesOfRandomWalk = 
        randomWalk 5.0 
        |> Seq.truncate 100
        |> Seq.toList



// ---------------------------------------------------------------
//         递归函数
// ---------------------------------------------------------------

module RecursiveFunctions  = 
              
    /// 计算整数的阶乘。使用“let rec”定义递归函数
    let rec factorial n = 
        if n = 0 then 1 else n * factorial (n-1)

    /// 计算两个整数的最大公因数。
    //  由于所有递归调用都是尾调用，因此编译器会将该函数转变成一个循环，
    //  这可提高性能并降低内存消耗。
    let rec greatestCommonFactor a b =                       
        if a = 0 then b
        elif a < b then greatestCommonFactor a (b - a)           
        else greatestCommonFactor (a - b) b

    /// 使用递归计算列表中的整数的总和。
    let rec sumList xs =
        match xs with
        | []    -> 0
        | y::ys -> y + sumList ys

    /// 通过将 Helper 函数与结果累加器一起使用，使将该函数成为尾递归函数
    let rec private sumListTailRecHelper accumulator xs =
        match xs with
        | []    -> accumulator
        | y::ys -> sumListTailRecHelper (accumulator+y) ys

    let sumListTailRecursive xs = sumListTailRecHelper 0 xs



// ---------------------------------------------------------------
//         记录类型
// ---------------------------------------------------------------

module RecordTypes = 

    // 定义记录类型
    type ContactCard = 
        { Name     : string;
          Phone    : string;
          Verified : bool }
              
    let contact1 = { Name = "Alf" ; Phone = "(206) 555-0157" ; Verified = false }

    // 创建作为 contact1 的副本的新纪录，
    // 但“电话”和“已验证”字段具有不同的值
    let contact2 = { contact1 with Phone = "(206) 555-0112"; Verified = true }

    /// 将“ContactCard”对象转换为字符串
    let showCard c = 
        c.Name + " Phone: " + c.Phone + (if not c.Verified then " (unverified)" else "")
        


// ---------------------------------------------------------------
//         联合类型
// ---------------------------------------------------------------

module UnionTypes = 

    /// 表示扑克牌花色
    type Suit = 
        | Hearts 
        | Clubs 
        | Diamonds 
        | Spades

    /// 表示扑克牌点数
    type Rank = 
        /// 表示扑克牌点数 2 .. 10
        | Value of int
        | Ace
        | King
        | Queen
        | Jack
        static member GetAllRanks() = 
            [ yield Ace
              for i in 2 .. 10 do yield Value i
              yield Jack
              yield Queen
              yield King ]
                                   
    type Card =  { Suit: Suit; Rank: Rank }
              
    /// 返回表示卡片叠中的所有卡片的列表
    let fullDeck = 
        [ for suit in [ Hearts; Diamonds; Clubs; Spades] do
              for rank in Rank.GetAllRanks() do 
                  yield { Suit=suit; Rank=rank } ]

    /// 将“Card”对象转换为字符串
    let showCard c = 
        let rankString = 
            match c.Rank with 
            | Ace -> "Ace"
            | King -> "King"
            | Queen -> "Queen"
            | Jack -> "Jack"
            | Value n -> string n
        let suitString = 
            match c.Suit with 
            | Clubs -> "clubs"
            | Diamonds -> "diamonds"
            | Spades -> "spades"
            | Hearts -> "hearts"
        rankString  + " of " + suitString

    let printAllCards() = 
        for card in fullDeck do 
            printfn "%s" (showCard card)



// ---------------------------------------------------------------
//         选项类型
// ---------------------------------------------------------------

module OptionTypes = 
    /// 选项值是用“Some”或“None”标记的任何类型的值。
    /// 它们在 F# 代码中广泛用于表示许多其他
    /// 语言使用 null 引用的用例。

    type Customer = { zipCode : decimal option }

    /// 用于计算客户的邮政编码对应的送货区域的抽象类，
    /// 假定提供了“getState”和“getShippingZone”抽象方法的实现。
    [<AbstractClass>]
    type ShippingCalculator =
        abstract getState : decimal -> string option
        abstract getShippingZone : string -> int

        /// 返回与客户的邮政编码对应的送货区域
        /// 客户可能还没有邮政编码或邮政编码可能无效
        member this.customerShippingZone(customer : Customer) =
            customer.zipCode |> Option.bind this.getState |> Option.map this.getShippingZone



// ---------------------------------------------------------------
//         模式匹配
// ---------------------------------------------------------------

module PatternMatching = 

    /// 人员的姓氏和名字的记录
    type Person = {     
        First : string
        Last  : string
    }

    /// 定义 3 种不同类型的员工的已区分联合
    type Employee = 
        | Engineer  of Person
        | Manager   of Person * list<Employee>            // 经理有一些下属
        | Executive of Person * list<Employee> * Employee // 主管也有一名助理

    /// 对管理层次结构中员工下面的每个人员计数，包括该员工本人
    let rec countReports(emp : Employee) = 
        1 + match emp with
            | Engineer(id) -> 
                0
            | Manager(id, reports) -> 
                reports |> List.sumBy countReports 
            | Executive(id, reports, assistant) ->
                (reports |> List.sumBy countReports) + countReports assistant


    /// 查找没有任何下属的名为“Dave”的所有经理/主管
    let rec findDaveWithOpenPosition(emps : Employee list) =
        emps 
        |> List.filter(function 
                       | Manager({First = "Dave"}, []) -> true       // [] 与空列表匹配
                       | Executive({First = "Dave"}, [], _) -> true
                       | _ -> false)                                 // “_”是与任何对象都匹配的通配符模式
                                                                     // 这将处理“否则”情况



// ---------------------------------------------------------------
//         度量单位
// ---------------------------------------------------------------

module UnitsOfMeasure = 

    // 对数字类型使用 F# 算法时可使用度量单位对代码进行批注

    open Microsoft.FSharp.Data.UnitSystems.SI.UnitNames

    [<Measure>]
    type mile =
        /// 英里到米的换算系数: 米在 SI.UnitNames 中定义
        static member asMeter = 1600.<meter/mile>

    let d  = 50.<mile>          // 使用英制单位表示的距离
    let d' = d * mile.asMeter   // Same distance expressed using metric system

    printfn "%A = %A" d d'
    // let error = d + d'       // 编译错误: 度量单位不匹配



// ---------------------------------------------------------------
//         平行数组编程
// ---------------------------------------------------------------

module ParallelArrayProgramming = 
              
    let oneBigArray = [| 0 .. 100000 |]
    
    // 执行某个占用大量 CPU 的计算 
    let rec computeSomeFunction x = 
        if x <= 2 then 1 
        else computeSomeFunction (x - 1) + computeSomeFunction (x - 2)
       
    // 执行针对大型输出数组的并行映射
    let computeResults() = oneBigArray |> Array.Parallel.map (fun x -> computeSomeFunction (x % 20))

    printfn "Parallel computation results: %A" (computeResults())



// ---------------------------------------------------------------
//         使用事件
// ---------------------------------------------------------------

module Events = 

    open System

    // 创建包含订阅点(event.Publish)和事件触发器(event.Trigger)的 Event 对象的实例
    let simpleEvent = new Event<int>() 

    // 添加处理程序
    simpleEvent.Publish.Add(
        fun x -> printfn "this is handler was added with Publish.Add: %d" x)

    // 触发事件
    simpleEvent.Trigger(5)

    // 创建遵循标准 .NET 约定的 Event 的实例: (sender, EventArgs)
    let eventForDelegateType = new Event<EventHandler, EventArgs>()    

    // 添加处理程序
    eventForDelegateType.Publish.AddHandler(
        EventHandler(fun _ _ -> printfn "this is handler was added with Publish.AddHandler"))

    // 触发事件(请注意，应设置 sender 参数)
    eventForDelegateType.Trigger(null, EventArgs.Empty)



// ---------------------------------------------------------------
//         使用类型提供程序的数据库访问
// ---------------------------------------------------------------

module DatabaseAccess = 
              
    // 从 F# 访问 SQL 数据库的最简单方式是使用 F# 类型提供程序。
    // 添加对 System.Data、System.Data.Linq 和 FSharp.Data.TypeProviders.dll 的引用。
    // 可以使用服务器资源管理器来生成 ConnectionString。

    (*
    #r "System.Data"
    #r "System.Data.Linq"
    #r "FSharp.Data.TypeProviders"

    open Microsoft.FSharp.Data.TypeProviders
    
    type SqlConnection = SqlDataConnection<ConnectionString = @"Data Source=.\sqlexpress;Initial Catalog=tempdb;Integrated Security=True">
    let db = SqlConnection.GetDataContext()

    let table = 
        query { for r in db.Table do
                select r }
    *)


    // 也可以使用 SqlEntityConnection 来代替 SqlDataConnection，前者使用 Entity Framework 访问数据库。

    ()



// ---------------------------------------------------------------
//         使用类型提供程序的 OData 访问
// ---------------------------------------------------------------

module OData = 

    (*
    open System.Data.Services.Client
    open Microsoft.FSharp.Data.TypeProviders

    //  使用 Azure Marketplace 中的人口统计和收入 OData 服务。
    // 有关详细信息，请参见 http://go.microsoft.com/fwlink/?LinkId=239712
    type Demographics = Microsoft.FSharp.Data.TypeProviders.ODataService<ServiceUri = "https://api.datamarket.azure.com/Esri/KeyUSDemographicsTrial/">
    let ctx = Demographics.GetDataContext()

    // 在 https://datamarket.azure.com/account/info 上注册 Azure Marketplace 帐户
    ctx.Credentials <- System.Net.NetworkCredential ("<your liveID>", "<your Azure Marketplace Key>")

    let cities = query {
        for c in ctx.demog1 do
        where (c.StateName = "Washington")
        } 

    for c in cities do
        printfn "%A - %A" c.GeographyId c.PerCapitaIncome2010.Value
    *)

    ()



#if COMPILED
module BoilerPlateForForm = 
    [<System.STAThread>]
    do ()
    do System.Windows.Forms.Application.Run()
#endif
