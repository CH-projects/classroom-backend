import express from "express";
import {and, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {departments, subjects} from "../db/schema/index.js";
import {db} from "../db/index.js";

const router = express.Router();

//get all subjects with optional search filtering and pagination
router.get("/", async (req, res) => {
    try {
        const {search, department, page, limit} = req.query;

        const parsePaginationParam = (param: any, defaultValue: number, maxLimit?: number) => {
            if (param === undefined) return defaultValue;
            const val = Number(param);
            if (!Number.isInteger(val) || val <= 0 || String(param) !== String(val)) {
                return null;
            }
            if (maxLimit && val > maxLimit) return maxLimit;
            return val;
        };

        const currentPage = parsePaginationParam(page, 1);
        const limitPerPage = parsePaginationParam(limit, 10, 100); // Assuming 100 as max limit

        if (currentPage === null || limitPerPage === null) {
            res.status(400).json({ error: "Invalid pagination parameters. Page and limit must be positive integers." });
            return;
        }

        const offset = (currentPage - 1) * limitPerPage;
         const filterConditions =[];

         //If search query exists , filter by subject name OR subject code
        if(search) {
            filterConditions.push(
                or (
                    ilike(subjects.name,`%${search}%`),
                    ilike(subjects.code,`%${search}%`),
                )
            )
        }

        //if department filter exists, match department name
        if(department) {
            filterConditions.push(ilike(departments.name,`%${department}%`));
        }

        //Combine all filters using AND if any exists
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({count: sql<number>`count(*)`.mapWith(Number)})
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id) )
            .where(whereClause);

       const totalCount = countResult[0] ?. count ?? 0;

       const subjectList = await db
           .select({
               ...getTableColumns(subjects),
           department: { ...getTableColumns(departments) }
          }).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id))
           .where(whereClause)
           .orderBy(desc(subjects.created), subjects.id)
           .limit(limitPerPage)
           .offset(offset);

       res.status(200).json({
           data: subjectList,
           pagination: {
               page: currentPage,
               limit: limitPerPage,
               total: totalCount,
               totalPages: Math.ceil(totalCount / limitPerPage),


           }
       });

    }catch (e) {
        console.error(`GET /subjects error: ${e}`);
        res.status(500).json({error: 'Failed to get subjects'});
    }
})

export default router;