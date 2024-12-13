package pro.karagodin;

import com.google.gson.Gson;

import java.util.function.Function;

public class DeleteTableHandler implements Function<Request, Response> {

	private final EntityManager entityManager = new EntityManager(System.getenv("DATABASE"), System.getenv("ENDPOINT"));

	@Override
	public Response apply(Request request) {
		if ("DELETE".equals(request.httpMethod)) {
			entityManager.deleteTable();
			return new Response(200, "");
		} else {
			return new Response(405, "");
		}
	}
}
